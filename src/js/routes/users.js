define([
  'routes/base',
  'stores/accounts'
], function(Route, AccountStore) {
  new Route('users', {
    accessPolicy: 'private',

    model: function() {
      this.setStatus('Loading accounts...');
      return AccountStore.fetch();
    },

    enter: function() {
      this.clearStatus();

      this.listenTo(AccountStore, 'change', this.updateProps);
      this.updateProps();
    },

    updateProps: function() {
      this.update({
        activeAccountId: AccountStore.activeAccountId()
      });
    }
  });
});