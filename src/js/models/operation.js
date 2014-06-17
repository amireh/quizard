define(function(require) {
  var Pixy = require('pixy');
  var K = require('constants');
  var _ = require('underscore');
  var clone = _.clone;
  var extend = _.extend;
  var pick = _.pick;
  var t = require('i18n!operations');

  var toSeconds = function(milliseconds) {
    return milliseconds / 1000.0;
  };

  var MAX_LOG_SIZE = 10;
  var logGUID = 0;

  var ALLOWED_ATTRS = [ 'count', 'itemCount' ];

  /**
   * @class OperationStatus
   *
   * These objects go with BatchedOperation runners to update the user with
   * the status of the batched operation.
   *
   * The API allows you to mark every action you're doing which the UI can
   * consume and present helpful things to the user.
   *
   * @event change
   *        Triggered when-ever the operation status has changed.
   */
  return Pixy.Object.extend({
    name: 'Operation',

    defaults: {
      /**
       * @property {String} status
       *
       * The current status of the operation. Can be one of:
       *
       *  - OPERATION_ACTIVE
       *    Default starting state, indicates the operation is running and is
       *    performing actions.
       *
       *  - OPERATION_COMPLETE
       *    The operation has performed all actions as expected and is done.
       *
       *  - OPERATION_FAILED
       *    An error was encountered performing an action and was either
       *    unrecoverable, or the user chose to stop.
       *
       *  - OPERATION_ABORTED
       *    The user has pre-emptively aborted the operation.
       */
      status: K.OPERATION_ACTIVE,

      /**
       * @property {String} action
       *
       * The current action being performed. Usually a status code found in
       * constants.
       */
      action: undefined,

      /**
       * @property {Any} [item=null]
       *
       * An item that maps to the current action.
       */

      /**
       * @property {Number} completed
       *
       * Number of actions that were successfully performed.
       */
      completed: 0,

      /**
       * @property {Number} failed
       *
       * The number of actions that failed. Only viable if running in non-atomic
       * mode, as atomic operations would fail as soon as any action fails.
       */
      failed: 0,

      /**
       * @property {String} error
       *
       * In case of operation failure (e.g, status is OPERATION_FAILED), this
       * would point to an error code meaningful to the operator's context.
       */
      error: undefined,

      /**
       * @property {Number} ETA
       *
       * ETA in seconds.
       */
      ETA: 0
    },

    /**
     * Create a new operation status. You should do this the moment you're
     * about to engage the batched operation runner.
     *
     * @param {String} name (required)
     *        A short name that uniquely describes the operation. Needed for
     *        stringifying actions (used as an i18n scope.)
     *
     * @param {String} attrs.title
     *        A title to represent to the user in a way the UI decides
     *        appropriate. This should probably describe what you're doing.
     *
     *        If unspecified, we'll try to translate the "title" property
     *        in your operation i18n scope.
     *
     * @param {Number} attrs.count (required)
     *        The number of actions you expect to perform.
     *
     * @param {Number} attrs.itemCount
     *        Number of "items" that your operation describes. This could be
     *        the number of users you're enrolling, or the number of quiz
     *        respondents you're submitting on their behalf.
     */
    constructor: function(name, attrs) {
      this.startedAt = new Date();
      this.lastActionAt = new Date();

      extend(this, this.defaults, pick(attrs, ALLOWED_ATTRS));

      this.name = name;
      this.log = [];
      this.title = attrs.title || this.t('title', null, attrs.titleParams);
    },

    /**
     * Main routine. Mark the current action you're performing.
     *
     * If an action had been marked previously, it will be considered complete
     * and successful. If it wasn't, mark its failure explicitly by calling
     * #markLastActionFailed().
     *
     * @param  {String|Number} actionCode
     *         A unique identifier (within the operation scope) for the action
     *         you're performing.
     *
     *         You should probably define this as a constant and translate it
     *         to something meaningful in the i18n space.
     *
     * @param  {Any} [item=null]
     *         Attach context to the action you're performing for UI purposes.
     *
     *         This could be a user ID, a quiz name, anything you may need for
     *         representation.
     *
     * @emit change
     */
    mark: function(actionCode, item) {
      if (this.action) {
        this.__markActionComplete(true);
      }

      if (actionCode) {
        this.logAction(actionCode, item);
        this.action = actionCode;
        this.item = item;
      }

      this.trigger('change');
    },

    markActionFailed: function() {
      if (this.action) {
        this.__markActionComplete(false);
      }
    },

    markFailed: function(error) {
      this.status = K.OPERATION_FAILED;
      this.error = error;

      this.trigger('change');
    },

    markAborted: function() {
      this.status = K.OPERATION_ABORTED;

      this.trigger('change');
      this.trigger('abort');
    },

    markComplete: function() {
      this.status = K.OPERATION_COMPLETE;

      this.trigger('change');
    },

    /**
     * Serialize the operation status into a JSON object ready for injecting
     * into the layout.
     *
     * @return {Object}
     *         See #defaults for an explanation of what's returned here.
     */
    toProps: function() {
      var props = pick(this, [
        'name',
        'title',
        'status',
        'count',
        'completed',
        'action',
        'item',
        'itemCount',
        'error'
      ]);

      props.ratio = this.getCompletionRatio();
      props.remaining = this.getRemainingCount();
      props.elapsed = toSeconds(new Date() - this.startedAt);
      props.log = clone(this.log);
      props.failed = this.failed;
      props.ETA = this.getETA();

      return props;
    },

    isActive: function() {
      return this.status === K.OPERATION_ACTIVE;
    },

    /**
     * @private
     */
    __markActionComplete: function(success) {
      var hasFailed = success === false;

      this.logCompletedAction(this.action, hasFailed);

      this.completed += 1;

      if (hasFailed) {
        ++this.failed;
      }

      this.action = this.item = undefined;
    },

    /**
     * @internal
     */
    getRemainingCount: function() {
      return this.count - this.completed;
    },

    /**
     * @internal
     */
    getCompletionRatio: function() {
      var count = this.count;

      if (!count) {
        return 0;
      }

      return (parseFloat(this.completed) / count) * 100.0;
    },

    /**
     * @internal
     */
    getETA: function() {
      var now, elapsed, timePerAction;

      if (this.count === 0) {
        return 0;
      }

      now = new Date();
      elapsed = now - this.startedAt; // milliseconds
      timePerAction = elapsed / parseFloat(this.completed);

      return this.getRemainingCount() * toSeconds(timePerAction);
    },

    /**
     * @internal
     */
    logAction: function(actionCode, item) {
      if (this.log.length >= MAX_LOG_SIZE) {
        this.log.pop();
      }

      this.log.unshift({
        id: ++logGUID,
        message: this.t(actionCode, 'actions', item),
        elapsed: 0
      });
    },

    /**
     * @internal
     */
    logCompletedAction: function(action, hasFailed) {
      var now, elapsed;

      if (!this.log.length) {
        return;
      }

      now = new Date();
      elapsed = now - this.lastActionAt;

      this.lastActionAt = now;

      this.log[0].elapsed = toSeconds(elapsed);

      if (hasFailed) {
        this.log[0].failed = true;
      }
    },

    t: function(actionCode, i18nScope, options) {
      var key = [ this.name ];

      if (i18nScope) {
        key.push(i18nScope);
      }

      key.push(actionCode);

      return t(key.join('.'), extend({ defaultValue: actionCode }, options));
    }
  });
});