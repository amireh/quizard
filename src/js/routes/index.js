define([
  'routes/base',
  'jsx!views/index',
], function(Route, View) {
  new Route('index', {
    views: [{ component: View }],
    navLink: '/'
  });
});