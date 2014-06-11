define(function(require) {
  var Pixy = require('pixy');
  var RSVP = require('rsvp');

  var get = function(collection, id) {
    return collection.get(id);
  };

  var preferenceKey = function(store, attr) {
    return [ store.name.underscore().camelize(), attr ].join('_');
  };

  var findRemote = function(collection, id, resolve, reject) {
    var resource = collection.push({ id: id });
    resource.fetch().then(resolve, function(error) {
      collection.remove(resource);
      reject(error);
    });
  };

  return Pixy.Store.extend({
    find: function(resourceId) {
      var that = this;

      return new RSVP.Promise(function(resolve, reject) {
        var resource = get(that.collection, resourceId);

        if (resource) {
          resolve(resource);
        } else {
          findRemote(that.collection, resourceId, resolve, reject);
        }
      }).then(function() {
        return that.get(resourceId);
      });
    },

    get: function(resourceId) {
      return get(this.collection, resourceId).toProps();
    },

    getAll: function() {
      return this.collection.toProps();
    },

    getActiveItemId: function() {
      return this.activeItemId;
    },

    activate: function(payload, onChange, onError) {
      var resource = get(this.collection, payload.id);

      if (resource) {
        this.activeItemId = payload.id;
        this.savePreferences('active', payload.id);

        onChange();
      } else {
        onError("Account with the id " + payload.id + " could not be resolved.");
      }
    },

    preference: function(attr) {
      return localStorage.getItem(preferenceKey(this, attr));
    },

    savePreferences: function(attr, value) {
      localStorage.setItem(preferenceKey(this, attr), value);
    },

    clearPreference: function(attr) {
      localStorage.removeItem(preferenceKey(this, attr));
    }
  });
});