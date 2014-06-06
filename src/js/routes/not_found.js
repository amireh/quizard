define([
  'routes/secondary',
  'jsx!views/not_found'
], function(SecondaryRoute, View) {
  new SecondaryRoute('notFound', {
    windowTitle: '404 - Quizard',
    views: [{
      component: View,
      into: 'dialogs'
    }]
  });
});