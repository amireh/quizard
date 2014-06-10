define([
  'routes/base',
  'stores/quizzes'
], function(Route, QuizStore) {
  new Route('quizzes', {
    accessPolicy: 'private'
  });
});