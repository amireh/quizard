define([ 'moment', 'pikaday', 'ext/pixy', 'config' ],
function(moment, Pikaday, Pixy, Config) {
  'use strict';

  var momentConfig = {
    toString: function() {
      return 'MomentInitializer';
    },

    initWithUser: function(user) {
      user.on('change:preferences.dateFormat', this.setUserFormat, this);
    },

    setUserFormat: function(user) {
      var format = user.preference('dateFormat');

      if (!format || !format.length) {
        format = Config.defaultPreferences.user.dateFormat;
      }

      moment.lang('en', {
        longDateFormat: {
          L: format,
          LL: Config.apiDateFormat
        },
        calendar : {
          lastDay : '[Yesterday]',
          sameDay : '[Today]',
          nextDay : '[Tomorrow]',
          lastWeek : '[Last] dddd',
          nextWeek : format,
          sameElse : format
        }
      });

      Pikaday.setup({ format: format });
    }
  };

  Pixy.Registry.addDependency('user', momentConfig);

  momentConfig.setUserFormat({
    preference: function() {
      return Config.defaultPreferences.user.dateFormat;
    }
  });
});