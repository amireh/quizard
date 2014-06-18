define([
  'pixy',
  'underscore',
  'rsvp',
  'constants',
  'ext/jquery/ajax'
], function(Pixy, _, RSVP, K, ajax) {
  var store;
  var apiToken;
  var active;
  var session = new Pixy.Model({}, {
    url: '/users/self/profile'
  });

  ajax({
    mutator: function(xhrOptions) {
      xhrOptions.headers.Authorization = 'Bearer ' + (apiToken || '');
    }
  });

  /**
   * Authenticate your client session with the Canvas API.
   *
   * @param {Object} payload
   * @param {String} payload.apiToken
   *        Admin API token.
   */
  function create(payload, onChange, onError) {
    apiToken = payload.apiToken;
    localStorage.setItem('apiToken', apiToken);

    active = false;

    session.fetch().then(function() {
      active = true;
      onChange();
    }).catch(onError);
  }

  function destroy(onChange) {
    apiToken = undefined;
    localStorage.removeItem('apiToken');
    active = false;

    onChange();
  }

  store = new Pixy.Store('SessionStore', {
    isActive: function() {
      return !!active;
    },

    get: function() {
      return {
        id: session.get('id') + '',
        name: session.get('name'),
        email: session.get('login_id')
      };
    },

    fetch: function() {
      return new RSVP.Promise(function(resolve, reject) {
        create({ apiToken: localStorage.apiToken }, resolve, reject);
      });
    },

    onAction: function(action, payload, onChange, onError) {
      switch(action) {
        case K.SESSION_CREATE: create(payload, onChange, onError);
        break;
        case K.SESSION_DESTROY: destroy(onChange, onError);
        break;
      }
    }
  });

  session.on('change', store.emitChange, store);

  return store;
});