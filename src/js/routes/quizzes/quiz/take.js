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
        quizTaking: QuizTakingStore.toProps()
      });
    }
  });
});