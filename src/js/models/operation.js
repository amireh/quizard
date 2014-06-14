define(function(require) {
  var Pixy = require('pixy');
  var _ = require('underscore');
  var clone = _.clone;
  var extend = _.extend;
  var pick = _.pick;

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

      ETA: 0
    },

    initialize: function(attrs) {
      this.log = [];
      this.startedAt = new Date();
      this.lastActionAt = new Date();

      extend(this, this.defaults, attrs);
    },

    mark: function(nextAction) {
      var emitChange = this.trigger.bind(this, 'change');

      this.logCompletedAction(this.action);

      if (!nextAction) {
        return emitChange();
      }

      this.logAction(nextAction);

      this.action = nextAction;
      this.completed = this.completed + 1;
      this.ETA = this.getETA();

      emitChange();
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

      if (this.count === 0) {
        return 0;
      }

      now = new Date();
      elapsed = now - this.startedAt; // milliseconds
      elapsedSeconds = parseFloat(toSeconds(elapsed));

      return this.getCompletionRatio() / elapsedSeconds;
    },

    logCompletedAction: function() {
      var now, elapsed;

      if (!this.log.length) {
        return;
      }

      now = new Date();
      elapsed = now - this.lastActionAt;

      this.lastActionAt = now;

      this.log[0].elapsed = toSeconds(elapsed);
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
      var props = pick(this, 'count', 'completed', 'action', 'ETA');

      props.ratio = this.getCompletionRatio();
      props.remaining = this.getRemainingCount();
      props.elapsed = toSeconds(new Date() - this.startedAt);
      props.log = clone(this.log);
      props.aps = this.getProcessingRate();

      return props;
    }
  });
});