define(function(require) {
  var Pixy = require('pixy');
  var K = require('constants');
  var QuizTaker = require('models/quiz_taker');
  var QuizSubmissions = require('stores/quiz_submissions');
  var store, quizTaker;

  var setStatus = function(message) {
    console.debug('Status:', message);

    store.status = message;
    store.emitChange();
  };

  /**
   * Take a quiz!
   *
   * This does three things:
   *
   *  1. it prepares the quiz submission by either locating the current, untaken
   *     one, or by creating a new one if possible
   *  2. it answers the submission using the QuizTaker module
   *  3. it turns it in
   */
  var take = function(onChange, onError) {
    var failureEmitter = function(statusCode) {
      return function(apiError) {
        console.warn('API operation failure:', apiError, apiError.stack);
        setStatus(statusCode);
        onError(statusCode);

        throw apiError;
      };
    };

    var prepIt = function() {
      setStatus(K.QUIZ_TAKING_STATUS_PREPARING);

      return QuizSubmissions.findOrCreate(quizTaker.quiz, undefined);
    };

    var answerIt = function(quizSubmission) {
      setStatus(K.QUIZ_TAKING_STATUS_ANSWERING);

      quizTaker.prepareAnswers();

      return QuizSubmissions.saveAnswers(quizSubmission, quizTaker.toJSON());
    };

    var turnItIn = function(quizSubmission) {
      setStatus(K.QUIZ_TAKING_STATUS_TURNING_IN);
      return QuizSubmissions.turnIn(quizSubmission);
    };

    prepIt()
      .catch(failureEmitter(K.QUIZ_TAKING_STATUS_PREPARATION_FAILED))
      .then(answerIt)
      .catch(failureEmitter(K.QUIZ_TAKING_STATUS_ANSWERING_FAILED))
      .then(turnItIn)
      .catch(failureEmitter(K.QUIZ_TAKING_STATUS_TURNING_IN_FAILED))
      .then(function() {
        setStatus(K.QUIZ_TAKING_STATUS_IDLE);
        onChange();
      });
  };

  store = new Pixy.Store('quizTakingStore', {
    status: K.QUIZ_TAKING_STATUS_IDLE,

    build: function(quiz) {
      quizTaker = new QuizTaker({}, { quiz: quiz });
      this.emitChange();
    },

    toProps: function() {
      var props = quizTaker.toProps();

      props.status = this.status;

      return props;
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

        case K.QUIZ_TAKING_TAKE:
          take(onChange, onError);
        break;
      }
    },

    reset: function() {
      quizTaker = undefined;
    }
  });

  return store;
});