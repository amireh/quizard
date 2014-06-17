define([
  'ext/pixy',
  'underscore',
  'rsvp',
  'constants',
  'core/session',
  'ext/jquery/ajax'
], function(Pixy, _, RSVP, K, Session, ajax) {
  var store;
  var apiToken;
  var active;

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

    Session.fetch().then(function() {
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
        id: Session.get('id') + '',
        name: Session.get('name'),
        email: Session.get('login_id')
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

  Session.on('change', store.emitChange, store);

  return store;
});