define([
  'ext/pixy',
  'underscore',
  'constants',
  'models/account'
], function(Pixy, _, K, Account) {
  var store, activeAccountId;

  var collection = new Pixy.Collection(undefined, {
    model: Account,
    url: '/accounts'
  });

  var NOOP = function(){};
  var get = function(id) {
    return collection.get(id);
  };

  var activate = function(payload, onChange, onError) {
    var account = get(payload.id);

    if (account) {
      activeAccountId = payload.id;
      localStorage.setItem('activeAccountId', payload.id);

      onChange();
    } else {
      onError("Account with the id " + payload.id + " could not be resolved.");
    }
  };

  store = new Pixy.Store('AccountStore', {
    fetch: function() {
      var _activeAccountId = localStorage.activeAccountId;

      localStorage.removeItem('activeAccountId');
      activeAccountId = undefined;

      return collection.fetch({ reset: true }).then(function() {
        if (_activeAccountId) {
          activate({ id: _activeAccountId }, store.emitChange.bind(store), NOOP);
        }

        return store.getAll();
      });
    },

    getAll: function() {
      return collection.toJSON();
    },

    /**
     * The account currently marked as active.
     *
     * @return {String|undefined}
     */
    getActiveAccountId: function() {
      return activeAccountId;
    },

    getUserCollection: function() {
      if (activeAccountId) {
        return collection.get(activeAccountId).users;
      }
    },

    onAction: function(action, payload, onChange, onError) {
      switch(action) {
        case K.ACCOUNT_ACTIVATE:
          activate(payload, onChange, onError);
        break;
      }
    }
  });

  return store;
});