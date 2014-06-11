define([
  'ext/pixy',
  'stores/sessions',
  'constants',
  'store'
], function(Pixy, SessionStore, K, Store) {
  'use strict';

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

  Pixy.Registry.options.mute = true;
});