var K = require('constants');
var Route = require('routes/base');
var QuizTakingStore = require('../../../stores/quiz_taking');
var Users = require('stores/users');
var View = require('../../../views/quizzes/take.jsx');

module.exports = new Route('takeQuiz', {
  navLink: K.RECIPE_TAKE_QUIZ,
  views: [{ component: View }],

  setup: function() {
    QuizTakingStore.build(this.modelFor('quiz'));
  },

  enter: function() {
    QuizTakingStore.addChangeListener(this.updateProps, this);
    QuizTakingStore.addErrorListener(this.injectStoreError, this);

    this.updateProps();
  },

  updateProps: function() {
    this.update({
      quizTaking: QuizTakingStore.toProps(),
      studentCount: Users.getStudentCount()
    });
  }
});