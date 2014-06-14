define(function(require) {
  var Route = require('routes/secondary');
  var View = require('jsx!views/recipes/enroll_students/progress');
  new Route('enrollStudentsProgress', {
    views: [{ component: View, into: 'dialogs' }]
  });
});