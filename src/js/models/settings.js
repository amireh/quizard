define(function(require) {
  var Pixy = require('pixy');
  var K = require('constants');
  var Config = require('config');

  var Settings = Pixy.Model.extend({
    url: '/settings',

    cache: {
      manual: true,
      key: 'settings'
    },

    defaults: {
      apiHost: Config.apiHost,
    }
  });

  return Settings;
});