define(function(require) {
  var Route = require('routes/secondary');
  var View = require('jsx!views/quizzes/take/progress');
  new Route('takeQuizProgress', {
    views: [{ component: View, into: 'dialogs' }]
  });
});