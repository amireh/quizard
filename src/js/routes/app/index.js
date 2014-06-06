define([
  'routes/base',
  'jsx!views/app/index'
], function(Route, View) {
  new Route('appIndex', {
    views: [{ component: View }]
  });
});