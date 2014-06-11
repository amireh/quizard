define([
  'routes/base',
  'stores/quizzes',
  'jsx!views/app/quizzes/take'
], function(Route, QuizStore, View) {
  new Route('takeQuiz', {
    views: [{ component: View }],

    enter: function() {
      this.updateProps();
    },

    updateProps: function() {
    }
  });
});