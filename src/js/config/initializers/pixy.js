define([
  'pixy',
  'ext/jquery/ajax',
  'config',
  'stores/sessions',
  'constants',
  'store'
], function(Pixy, ajax, Config, SessionStore, K, Store) {
  'use strict';

  Pixy.ajax = ajax({
    host:     Config.apiHost,
    timeout:  Config.xhr.timeout
  });

  Pixy.configure({
    isAuthenticated: function() {
      return SessionStore.isActive();
    },

    getCurrentLayoutName: function() {
      return 'appLayout';
    },

    getDefaultWindowTitle: function() {
      return 'Quizard - Canvas Quiz Hax';
    }
  });

  // Install Cache storage adapter
  Pixy.Cache.setAdapter(Store);
  Pixy.Cache.setAvailable(Store.enabled);
  Pixy.Cache.enable();

  Pixy.Collection.setDefaultOptions('add', { parse: true });
  Pixy.Collection.setDefaultOptions('set', { parse: true });

  Pixy.Registry.options.mute = true;
});