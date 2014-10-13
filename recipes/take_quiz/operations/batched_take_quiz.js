define(function(require) {
  var t = require('i18n!take_quiz');
  var K = require('constants');
  var BatchedOperation = require('models/batched_operation');
  var QuizSubmissions = require('stores/quiz_submissions');

  return new BatchedOperation({
    setup: function(context) {
      context.studentIndex = 0;
    },

    runner: function(context) {
      var quizTaker = context.quizTaker;
      var quiz = quizTaker.quiz;
      var studentResponse = context.studentResponses[context.studentIndex++];
      var responses = studentResponse.responses;
      var userId = studentResponse.id;

      var prepIt = function() {
        context.status = K.QUIZ_TAKING_PREPARING;
        context.operation.mark(t(context.status, 'Generating submission.'));
        return QuizSubmissions.findOrCreate(quiz, userId);
      };

      var answerIt = function(quizSubmission) {
        context.status = K.QUIZ_TAKING_ANSWERING;
        context.operation.mark(t(context.status, 'Answering.'));
        return QuizSubmissions.saveAnswers(quizSubmission, userId, responses);
      };

      var turnItIn = function(quizSubmission) {
        context.status = K.QUIZ_TAKING_TURNING_IN;
        context.operation.mark(t(context.status, 'Turning it in.'));
        return QuizSubmissions.turnIn(quizSubmission, userId);
      };

      return prepIt().then(answerIt).then(turnItIn);
    },

    onDone: function(output, context) {
      context.operation.mark();
      context.emitChange();
    },

    onError: function(error, context, resolve, reject) {
      var errorCode;
      var operation = context.operation;
      var emitChange = context.emitChange;

      console.warn('API operation failure:', error, error && error.stack);

      switch(context.status) {
        case K.QUIZ_TAKING_PREPARING:
          errorCode = K.QUIZ_TAKING_PREPARATION_FAILED;
        break;
        case K.QUIZ_TAKING_ANSWERING:
          errorCode = K.QUIZ_TAKING_ANSWERING_FAILED;
        break;
        case K.QUIZ_TAKING_TURNING_IN:
          errorCode = K.QUIZ_TAKING_TURNING_IN_FAILED;
        break;
      }

      if (context.atomic === true) {
        reject(errorCode);
      }
      else {
        operation.markActionFailed();
        emitChange();
        resolve();
      }
    }
  });
});