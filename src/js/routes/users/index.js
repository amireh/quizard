define([
  'routes/base',
  'jsx!views/users/index'
], function(Route, View) {
  new Route('userIndex', {
    views: [{ component: View }],

    enter: function() {
      this.update({
        navbar: {
          item: '/app/users'
        }
      });
    }
  });
});