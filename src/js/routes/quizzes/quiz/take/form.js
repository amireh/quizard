define(function(require) {
  var Route = require('routes/base');
  var View = require('jsx!views/quizzes/take');
  var QuizTaking = require('stores/quiz_taking');
  var K = require('constants');

  return new Route('takeQuizForm', {
    views: [{ component: View }],

    events: {
      willTransition: function(transition) {
        if (transition.targetName === 'takeQuizProgress') {
          this.progressShown = true;
        }
      }
    },

    enter: function() {
      this.progressShown = false;
      this.listenTo(QuizTaking, 'change:status', this.showProgress);
    },

    showProgress: function(status) {
      var quiz;
      var course;

      if (status === K.QUIZ_TAKING_STARTED) {
        quiz = this.modelFor('quiz');
        course = this.modelFor('course');

        this.transitionTo('/courses/' + course.id + '/quizzes/' + quiz.id + '/take/progress');
      }
    },

    shouldUnmount: function() {
      return !this.progressShown;
    }
  });
});