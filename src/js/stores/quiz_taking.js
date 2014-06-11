define(function(require) {
  var Store = require('pixy').Store;
  var K = require('constants');
  var QuizTaker = require('models/quiz_taker');
  var quizTaker;

  var store = new Store('quizTakingStore', {
    build: function(quiz) {
      quizTaker = new QuizTaker(quiz);
      this.emitChange();
    },

    toProps: function() {
      return quizTaker.toProps();
    },

    onAction: function(action, payload, onChange, onError) {
      switch(action) {
        case K.QUIZ_TAKING_SET:
          if (quizTaker.set(payload)) {
            onChange();
          } else {
            onError(quizTaker.validationError);
          }
        break;
      }
    }
  });

  return store;
});