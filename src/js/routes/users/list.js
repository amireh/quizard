define([
  'routes/base',
  'jsx!views/users/list',
  'stores/accounts',
  'stores/users',
], function(Route, View, AccountStore, UserStore) {
  var flatten = _.flatten;
  var uniq = _.uniq;

  new Route('userList', {
    views: [{ component: View }],

    enter: function() {
      this.listenTo(UserStore, 'change', this.updateProps);
      this.listenTo(AccountStore, 'change', this.updateProps);
      this.updateProps();
    },

    updateProps: function() {
      var accounts = AccountStore.getAll();
      var users = accounts.map(function(account) {
        return UserStore.getAll(AccountStore.getUserCollection(account.id));
      });

      this.update({
        users: uniq(flatten(users, true), false, 'id'),
        navbar: {
          item: '/app/users',
          child: '/app/users/list'
        }
      });
    }
  });
});