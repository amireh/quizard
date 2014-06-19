define(function(require) {
  var store;
  var Pixy = require('pixy');
  var K = require('constants');
  var ajaxConfig = require('ext/jquery/ajax');
  var Settings = require('models/settings');
  var settings = new Settings();

  settings.on('change:apiHost', function(_settings, apiHost) {
    ajaxConfig({
      host: apiHost
    });
  });

  store = new Pixy.Store('SettingStore', {
    onAction: function(action, payload, onChange, onError) {
      switch(action) {
        case K.SETTINGS_SAVE:
          if (settings.set(payload, { validate: true })) {
            settings.updateCacheEntry();
            onChange();
          } else {
            onError();
          }
        break;
      }
    },

    load: function() {
      settings.clear({ silent: true });
      settings.restore();
      settings.fetch({ useCache: true });
    },

    toProps: function() {
      return settings.toJSON();
    },

    reset: function() {
      settings.restore();
      settings.purgeCacheEntry();
    }
  });

  return store;
});