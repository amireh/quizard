define([
  'routes/base',
  'jsx!views/guest/login'
], function(Route, View) {
  new Route('guestIndex', {
    accessPolicy: 'public',
    views: [{ component: View, into: 'dialogs' }]
  });
});