define([
  'routes/base',
  'actions/sessions'
], function(Route, SessionActions) {
  new Route('logout', {
    enter: function() {
      SessionActions.destroy();
    }
  });
});