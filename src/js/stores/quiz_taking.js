define(function(require) {
  var Pixy = require('pixy');
  var K = require('constants');
  var QuizTaker = require('models/quiz_taker');
  var Operation = require('models/operation');
  var batchedTakeQuiz = require('./operations/batched_take_quiz');
  var Quizzes = require('stores/quizzes');
  var Users = require('stores/users');
  var store, quizTaker, operation, responseCount, status;

  var setStatus = function(code) {
    console.debug('Status:', code);

    status = code;
    store.emitChange('status', code);
  };

  var resetStatus = function() {
    setStatus(K.STATUS_IDLE);
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
  var take = function(payload, onChange, onError) {
    var students = Users.getAll().slice(0, responseCount);
    var studentResponses;

    operation = new Operation({
      count: responseCount * 3 + 1,
      itemCount: responseCount
    });

    operation.on('change', store.emitChange, store);

    setStatus(K.QUIZ_TAKING_STARTED);
    operation.mark('Generating responses...');

    try {
      quizTaker.assignRespondents(responseCount);
      studentResponses = quizTaker.generateResponses(students);
    }
    catch(e) {
      console.warn(e.stack);
      operation.markLastActionFailed();
      onError(K.QUIZ_TAKING_RESPONSE_GENERATION_FAILED);
      resetStatus();
      return;
    }

    batchedTakeQuiz.run(responseCount, {
      emitChange: store.emitChange.bind(store),
      operation: operation,
      quizTaker: quizTaker,
      studentResponses: studentResponses,
      atomic: payload.atomic
    }).then(function() {
      onChange();
    }, function() {
      onError();
    }).finally(function() {
      operation.mark();
      resetStatus();
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

    // TODO: fix this to use the maximum available students instead
    if (count < K.USER_MIN_ENROLL) {
      return onError();
    }
    else if (count > K.USER_MAX_ENROLL) {
      return onError();
    }

    responseCount = parseInt(count, 10);

    onChange();
  };


  store = new Pixy.Store('quizTakingStore', {
    getStatus: function() {
      return status;
    },

    build: function(quiz) {
      quizTaker = new QuizTaker({}, { quiz: Quizzes.collection.get(quiz.id) });
      this.emitChange();
    },

    toProps: function() {
      var props = {};

      if (operation) {
        props = operation.toProps();
      }

      props.status = status;
      props.responseCount = responseCount;

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
          take(payload, onChange, onError);
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
      responseCount = 0;
      operation = undefined;
      resetStatus();
    }
  });

  return store;
});