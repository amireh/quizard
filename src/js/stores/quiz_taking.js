define(function(require) {
  var Pixy = require('pixy');
  var K = require('constants');
  var QuizTaker = require('models/quiz_taker');
  var BatchedOperation = require('models/batched_operation');
  var Quizzes = require('stores/quizzes');
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

      // todo: multiple-user support
      var students = [{ id: 'self' }];
      var studentResponses = quizTaker.generateResponses(students);

      return QuizSubmissions.saveAnswers(quizSubmission, studentResponses[0].responses);
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

  var addAnswer = function(payload, onChange, onError) {
    var questionId = payload.questionId;

    quizTaker.addCustomAnswer(questionId).then(onChange, onError);
  };

  var addAnswerToVariant = function(payload, onChange, onError) {
    if (quizTaker.addAnswerToVariant(payload.questionId, payload.variantId, payload.answerId)) {
      onChange();
    } else {
      onError();
    }
  };

  var setResponseRatio = function(payload, onChange, onError) {
    var options = payload.options || {};
    var questionId = payload.questionId;
    var answerId = payload.answerId;
    var ratio = payload.ratio;
    var rc;

    if (options.variant) {
      rc = quizTaker.setVariantResponseRatio(questionId, answerId, ratio);
    }
    else {
      rc = quizTaker.setResponseRatio(questionId, answerId, ratio);
    }

    if (rc) {
      onChange();
      Quizzes.emitChange();
    } else {
      onError(quizTaker.validationError);
    }
  };

  var setResponseCount = function(payload, onChange, onError) {
    var count = payload.count;

    if (count < K.USER_MIN_ENROLL) {
      return onError();
    }
    else if (count > K.USER_MAX_ENROLL) {
      return onError();
    }

    quizTaker.assignRespondents(count);

    onChange();
  };

  var takeQuiz = new BatchedOperation({
    runner: function(params) {

    }
  });

  store = new Pixy.Store('quizTakingStore', {
    status: K.QUIZ_TAKING_STATUS_IDLE,

    build: function(quiz) {
      quizTaker = new QuizTaker({}, { quiz: Quizzes.collection.get(quiz.id) });
      this.emitChange();
    },

    toProps: function() {
      var props = {};

      props.status = this.status;
      props.responseCount = quizTaker.responseCount;

      return props;
    },

    onAction: function(action, payload, onChange, onError) {
      switch(action) {
        case K.QUIZ_TAKING_SET:
          if (quizTaker.set(payload)) {
            onChange();
            Quizzes.emitChange();
          } else {
            onError(quizTaker.validationError);
          }
        break;

        case K.QUIZ_TAKING_SET_RESPONSE_RATIO:
          setResponseRatio(payload, onChange, onError);
        break;

        case K.QUIZ_TAKING_SET_RESPONSE_COUNT:
          setResponseCount(payload, onChange, onError);
        break;

        case K.QUIZ_TAKING_TAKE:
          take(onChange, onError);
        break;

        case K.QUIZ_TAKING_ADD_ANSWER:
          addAnswer(payload, onChange, onError);
        break;

        case K.QUIZ_TAKING_ADD_VARIANT:
          if (quizTaker.addVariantToQuestion(payload.questionId)) {
            onChange();
            Quizzes.emitChange();
          } else {
            onError();
          }
        break;

        case K.QUIZ_TAKING_REMOVE_VARIANT:
          if (quizTaker.removeVariantFromQuestion(payload.questionId, payload.variantId)) {
            onChange();
            Quizzes.emitChange();
          } else {
            onError();
          }
        break;

        case K.QUIZ_TAKING_ADD_ANSWER_TO_VARIANT:
          addAnswerToVariant(payload, onChange, onError);
        break;
      }
    },

    reset: function() {
      quizTaker = undefined;
    }
  });

  return store;
});