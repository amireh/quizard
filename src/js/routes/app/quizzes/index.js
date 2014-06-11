define([
  'routes/base',
  'stores/quizzes',
  'jsx!views/app/quizzes/index'
], function(Route, QuizStore, View) {
  new Route('quizIndex', {
    views: [{ component: View }],

    enter: function() {
      this.listenTo(QuizStore, 'change', this.updateProps);
      this.listenTo(QuizStore, 'change:data', this.updateProps);
      this.updateProps();
    },

    updateProps: function() {
      this.update({
        quizzes: QuizStore.getAll(),
        activeQuizId: QuizStore.getActiveQuizId(),
        hasMoreQuizzes: QuizStore.hasMore()
      });
    }
  });
});