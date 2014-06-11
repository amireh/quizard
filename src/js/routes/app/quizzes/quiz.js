define([
  'routes/base',
  'stores/quizzes'
], function(Route, QuizStore) {
  new Route('quiz', {
    model: function(params) {
      this.setStatus('Loading Quiz#' + params.id);
      return QuizStore.fetch(params.id);
    },

    afterModel: function() {
      this.clearStatus();
    },

    enter: function() {
      this.listenTo(QuizStore, 'change', this.updateProps);
      this.listenTo(QuizStore, 'change:data', this.updateProps);
      this.updateProps();
    },

    updateProps: function() {
      this.update({
        quiz: QuizStore.getActiveQuiz()
      });
    }
  });
});