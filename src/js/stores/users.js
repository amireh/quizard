define([
  'ext/pixy',
  'underscore',
  'constants',
  'stores/accounts',
  'rsvp'
], function(Pixy, _, K, AccountStore, RSVP) {
  var store;
  var collection;

  var trackCollection = function() {
    collection = AccountStore.getUserCollection();
  };

  /**
   * Loads all users from all accounts.
   */
  var loadAll = function(onChange) {
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
  };

  var create = function(payload, onChange, onError) {
    var user = collection.add({
      user: {
        name: payload.name,
      },
      pseudonym: {
        unique_id: payload.email,
        password: payload.password,
        send_confirmation: false
      }
    }).last();

    user.save(undefined, { wait: true }).then(function(user) {
      onChange('create', user.get('id'));
    }).catch(function() {
      onError('User creation failed.');
    });
  };

  store = new Pixy.Store('UserStore', {
    fetch: function() {
      return collection.fetch({ reset: true }).then(function() {
        return store.getAll(collection);
      });
    },

    getAll: function(collection) {
      return collection.invoke('toProps');
    },

    onAction: function(action, payload, onChange, onError) {
      switch(action) {
        case K.USER_LOAD_ALL:
          loadAll(onChange);
        break;

        case K.USER_CREATE:
          create(payload, onChange, onError);
        break;
      }
    }
  });

  AccountStore.on('change', trackCollection);

  trackCollection();

  return store;
});