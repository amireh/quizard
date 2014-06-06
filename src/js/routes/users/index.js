define([
  'routes/base',
  'jsx!views/users/index',
  'stores/accounts',
  'stores/users',
], function(Route, View, AccountStore, UserStore) {
  new Route('userIndex', {
    views: [{ component: View }],

    enter: function() {
      this.update({
        navbar: {
          item: '/users'
        }
      });
    }
  });
});