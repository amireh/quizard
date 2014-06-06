define([
  'ext/pixy',
  'underscore',
  'constants',
  'stores/accounts',
  'rsvp'
], function(Pixy, _, K, AccountStore, RSVP) {
  var store;

  function loadAll(onChange, onError) {
    var collections = AccountStore.getAll().map(function(account) {
      return AccountStore.getUserCollection(account.id);
    });

    var fetches = collections.map(function(collection) {
      return collection.fetch().then(function() {
        onChange();
        return store.getAll(collection);
      });
    });

    return RSVP.all(fetches);
  }

  store = new Pixy.Store('UserStore', {
    fetch: function(collection) {
      if (!collection) {
        return RSVP.resolve([]);
      }

      return collection.fetch({ reset: true }).then(function() {
        return store.getAll(collection);
      });
    },

    getAll: function(collection) {
      if (!collection) {
        return [];
      }

      return collection.toJSON();
    },

    onAction: function(action, payload, onChange, onError) {
      switch(action) {
        case K.USER_LOAD_ALL:
          loadAll(onChange, onError);
        break;
      }
    }
  });

  return store;
});