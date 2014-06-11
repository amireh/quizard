define([
  'routes/base',
  'stores/quizzes',
  'jsx!views/quizzes/take'
], function(Route, QuizStore, View) {
  new Route('takeQuiz', {
    views: [{ component: View }],
    navLink: '/take_quiz'
  });
});