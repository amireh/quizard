define(function(require) {
  var Pixy = require('pixy');
  var _ = require('underscore');
  var clone = _.clone;
  var extend = _.extend;
  var pick = _.pick;
  var findBy = _.findBy;

  var toSeconds = function(milliseconds) {
    return milliseconds / 1000.0;
  };

  var MAX_LOG_SIZE = 10;
  var logGUID = 0;

  return Pixy.Object.extend({
    name: 'Operation',

    defaults: {
      count: 0,
      completed: 0,

      item: undefined,
      itemCount: 0,

      /**
       * The current
       * @type {[type]}
       */
      action: undefined,

      /**
       * Whether the operation has failed as a whole.
       */
      failed: false,

      /**
       * In case of operation failure, this would point to a meaningful error
       * code.
       */
      error: undefined,

      /**
       * The number of actions that failed. Only viable if running in non-atomic
       * mode, as atomic operations would fail as soon as any action fails.
       */
      failureCount: 0,

      /**
       * ETA in seconds.
       */
      ETA: 0,

      /**
       * @property {Boolean} [aborted]
       *           Whether the operation was manually aborted by the user.
       */
      aborted: false
    },

    initialize: function(attrs) {
      this.log = [];
      this.startedAt = new Date();
      this.lastActionAt = new Date();
      this.firstActionAt = undefined;

      extend(this, this.defaults, attrs);
    },

    mark: function(nextAction, nextItem, hasFailed) {
      if (this.action) {
        this.logCompletedAction(this.action, hasFailed);

        this.completed = this.completed + 1;

        if (hasFailed) {
          ++this.failureCount;
        }

        this.action = undefined;
      }

      if (nextAction) {
        this.logAction(nextAction);

        this.action = nextAction;
        this.item = nextItem;

        console.debug('Operation: new action', nextAction,
          this.getCompletionRatio() + '%', '(', this.getProcessingRate(), ')');
      }

      this.trigger('change');
    },

    markLastActionFailed: function() {
      this.mark(undefined, undefined, true);
    },

    stop: function(error) {
      this.failed = true;
      this.error = error;
    },

    abort: function() {
      this.aborted = true;
    },

    isComplete: function() {
      return this.getRemainingCount() <= 0;
    },

    getRemainingCount: function() {
      return this.count - this.completed;
    },

    getCompletionRatio: function() {
      var count = this.count;

      if (!count) {
        return 0;
      }

      return (parseFloat(this.completed) / count) * 100.0;
    },

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

    getProcessingRate: function() {
      var now, elapsed, elapsedSeconds;

      // Forget the first 10%
      if (this.count === 0 || !this.firstActionAt) {
        return 0;
      }

      now = new Date();
      elapsed = now - this.firstActionAt; // milliseconds
      elapsedSeconds = toSeconds(elapsed);

      if (elapsed <= 1000) {
        return 0;
      }

      return this.getCompletionRatio() / elapsedSeconds;
    },

    logCompletedAction: function(action, hasFailed) {
      var now, elapsed;

      if (!this.log.length) {
        return;
      }

      now = new Date();
      elapsed = now - this.lastActionAt;

      this.lastActionAt = now;

      if (!this.firstActionAt) {
        this.firstActionAt = now;
      }

      this.log[0].elapsed = toSeconds(elapsed);

      if (hasFailed) {
        this.log[0].failed = true;
      }
    },

    logAction: function(message) {
      if (this.log.length >= MAX_LOG_SIZE) {
        this.log.pop();
      }

      this.log.unshift({
        id: ++logGUID,
        message: message,
        elapsed: 0
      });

      console.debug('Adding log entry:', message, this.log.length);
    },

    toProps: function() {
      var props = pick(this, [
        'count',
        'completed',
        'action',
        'failed',
        'item',
        'itemCount',
        'error',
        'aborted'
      ]);

      props.ratio = this.getCompletionRatio();
      props.remaining = this.getRemainingCount();
      props.elapsed = toSeconds(new Date() - this.startedAt);
      props.log = clone(this.log);
      props.aps = this.getProcessingRate();
      props.failures = this.failureCount;
      props.ETA = this.getETA();

      return props;
    }
  });
});