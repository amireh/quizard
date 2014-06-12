define(function(require) {
  var Route = require('routes/base');
  var K = require('constants');
  var QuizTakingStore = require('stores/quiz_taking');
  var View = require('jsx!views/quizzes/take');

  new Route('takeQuiz', {
    views: [{ component: View }],
    navLink: K.RECIPE_TAKE_QUIZ,

    model: function() {
      return QuizTakingStore.build(this.modelFor('quiz'));
    },

    enter: function() {
      QuizTakingStore.addChangeListener(this.updateProps, this);
      QuizTakingStore.addErrorListener(this.injectStoreError, this);

      this.updateProps();
    },

    updateProps: function() {
      this.update({
        status: this.statusLabel(QuizTakingStore.status),
        quizTaking: QuizTakingStore.toProps()
      });
    },

    statusLabel: function(statusCode) {
      var status;

      switch(statusCode) {
        case K.QUIZ_TAKING_STATUS_IDLE:
          status = 'Idle.';
        break;
        case K.QUIZ_TAKING_STATUS_PREPARING:
          status = 'Preparing submission.';
        break;
        case K.QUIZ_TAKING_STATUS_PREPARATION_FAILED:
          status = 'Submission preparation failed.';
        break;
        case K.QUIZ_TAKING_STATUS_ANSWERING:
          status = 'Answering quiz questions...';
        break;
        case K.QUIZ_TAKING_STATUS_ANSWERING_FAILED:
          status = 'Answering quiz questions failed.';
        break;
        case K.QUIZ_TAKING_STATUS_TURNING_IN:
          status = 'Turning the submission in...';
        break;
        case K.QUIZ_TAKING_STATUS_TURNING_IN_FAILED:
          status = 'Turning the submission in failed.';
        break;
        default:
      }

      return status;
    }
  });
});