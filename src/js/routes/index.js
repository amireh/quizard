define([
  'routes/base',
  'jsx!views/index'
], function(Route, View) {
  new Route('index', {
    windowTitle: 'Quizard - Canvas Quiz Hax',
    views: [{ component: View }]
  });
});