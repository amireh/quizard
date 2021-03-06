define([
  'routes/base',
  'stores/quizzes'
], function(Route, QuizStore) {
  new Route('quiz', {
    model: function(params) {
      return QuizStore.find(params.quiz_id).then(function(quiz) {
        return QuizStore.fetchQuestions(quiz.id);
      });
    },

    setup: function(model) {
      this.quizId = model.id;
      this.updateProps();
    },

    enter: function() {
      this.listenTo(QuizStore, 'change', this.updateProps);
      this.listenTo(QuizStore, 'change:data', this.updateProps);
    },

    updateProps: function() {
      this.update({
        quiz: QuizStore.get(this.quizId)
      });
    }
  });
});