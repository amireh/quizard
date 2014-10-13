define(function(require) {
  var Pixy = require('pixy');
  var K = require('constants');
  var QuizTaker = require('models/quiz_taker');
  var batchedTakeQuiz = require('../operations/batched_take_quiz');
  var Quizzes = require('stores/quizzes');
  var OperationStore = require('stores/operations');
  var Users = require('stores/users');
  var store, quizTaker, responseCount;

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
    var studentResponses, operation, descriptor;
    var students = Users.getAll().slice(0, responseCount);
    var isAtomic = payload.atomic;

    if (!responseCount) {
      return onError(K.RESPONSE_COUNT_REQUIRED);
    }
    else if (students.length < responseCount) {
      return onError(K.QUIZ_TAKING_NOT_ENOUGH_STUDENTS);
    }

    try {
      studentResponses = quizTaker.generateResponses(students);
    }
    catch(e) {
      console.warn(e.stack);
      return onError(K.QUIZ_TAKING_RESPONSE_GENERATION_FAILED);
    }

    operation = OperationStore.start('quiz_taking', {
      count: responseCount * 3,
      itemCount: responseCount,
      titleParams: {
        count: responseCount,
        quiz: quizTaker.quiz.get('name')
      }
    });

    descriptor = batchedTakeQuiz.run(responseCount, {
      emitChange: store.emitChange.bind(store),
      operation: operation,
      quizTaker: quizTaker,
      studentResponses: studentResponses,
      atomic: isAtomic
    });

    descriptor.promise.then(function() {
      onChange();
      operation.markComplete();
    }).catch(function(rc) {
      if (rc.code === K.OPERATION_ABORTED) {
        operation.markAborted();
      }
      else if (rc.code === K.OPERATION_FAILED) {
        operation.markFailed(rc.detail);
        onError(rc.detail);
      }
    });

    operation.on('abort', descriptor.abort);
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
      // Quizzes.emitChange();
    } else {
      onError(quizTaker.validationError);
    }
  };

  var randomizeResponseRatios = function(payload, onChange) {
    quizTaker.randomizeResponseRatios();

    onChange();
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
    debug: function() {
      return quizTaker;
    },

    build: function(quiz) {
      quizTaker = new QuizTaker({}, { quiz: Quizzes.collection.get(quiz.id) });
      this.emitChange();
    },

    toProps: function() {
      var props = {};

      props.responseCount = responseCount;

      return props;
    },

    onAction: function(action, payload, onChange, onError) {
      switch(action) {
        case K.QUIZ_TAKING_SET:
          if (quizTaker.set(payload)) {
            // onChange();
            Quizzes.emitChange();
          } else {
            onError(quizTaker.validationError);
          }
        break;

        case K.QUIZ_TAKING_SET_RESPONSE_RATIO:
          setResponseRatio(payload, onChange, onError);
        break;

        case K.QUIZ_TAKING_RANDOMIZE_RESPONSE_RATIOS:
          randomizeResponseRatios(payload, onChange, onError);
        break;

        case K.QUIZ_TAKING_SET_RESPONSE_COUNT:
          setResponseCount(payload, onChange, onError);
        break;

        case K.QUIZ_TAKING_TAKE:
          take(payload, onChange, onError);
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
    }
  });

  return store;
});