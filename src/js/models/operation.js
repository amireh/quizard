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

      action: undefined,
      failed: false,
      failureCount: 0,
      ETA: 0
    },

    initialize: function(attrs) {
      this.log = [];
      this.startedAt = new Date();
      this.lastActionAt = new Date();

      extend(this, this.defaults, attrs);
    },

    mark: function(nextAction, nextItem, hasFailed) {
      if (this.action) {
        this.logCompletedAction(this.action, hasFailed);

        this.completed = this.completed + 1;
        this.ETA = this.getETA();

        if (hasFailed) {
          ++this.failureCount;
        }
      }

      if (nextAction) {
        this.logAction(nextAction);

        this.action = nextAction;
        this.item = nextItem;

        console.debug('Operation: new action', nextAction, this.getCompletionRatio() + '%');
      }

      this.trigger('change');
    },

    abort: function(error) {
      this.failed = true;
      this.error = error;
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
      if (this.count === 0 || (0.1 > this.completed / this.count)) {
        return 0;
      }

      now = new Date();
      elapsed = now - this.startedAt; // milliseconds
      elapsedSeconds = parseFloat(toSeconds(elapsed));

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
        'ETA',
        'failed',
        'item',
        'itemCount',
        'error'
      ]);

      props.ratio = this.getCompletionRatio();
      props.remaining = this.getRemainingCount();
      props.elapsed = toSeconds(new Date() - this.startedAt);
      props.log = clone(this.log);
      props.aps = this.getProcessingRate();
      props.failures = this.failureCount;

      return props;
    }
  });
});