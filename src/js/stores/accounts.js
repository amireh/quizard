define(function(require) {
  var Pixy = require('ext/pixy');
  var Store = require('core/store');
  var K = require('constants');
  var Account = require('models/account');

  var store;

  var collection = new Pixy.Collection(undefined, {
    model: Account,
    url: '/accounts'
  });

  var NOOP = function(){};
  var get = function(id) {
    return collection.get(id);
  };

  store = new Store('AccountStore', {
    collection: collection,

    fetch: function() {
      var cachedId = this.preference('active');
      this.clearPreference('active');

      return collection.fetch({ reset: true }).then(function() {
        if (cachedId) {
          this.activate({ id: cachedId }, this.emitChange.bind(this), NOOP);
        }

        return this.getAll();
      }.bind(this));
    },

    // Activate an account and load its users from the cache, if any.
    activate: function(payload, onChange, onError) {
      Store.prototype.activate.call(this, payload, function() {
        var account = get(this.getActiveItemId());

        account.users.fetch({ useCache: true }).finally(onChange);
      }.bind(this), onError);
    },

    getUserCollection: function() {
      var account = get(this.getActiveItemId());

      if (account) {
        return account.users;
      }
    },

    onAction: function(action, payload, onChange, onError) {
      switch(action) {
        case K.ACCOUNT_ACTIVATE:
          this.activate(payload, onChange, onError);
        break;
      }
    }
  });

  return store;
});