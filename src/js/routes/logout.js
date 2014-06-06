define([
  'routes/base',
  'actions/sessions'
], function(Route, SessionActions) {
  new Route('logout', {
    accessPolicy: 'private',

    enter: function() {
      SessionActions.destroy();
    }
  });
});