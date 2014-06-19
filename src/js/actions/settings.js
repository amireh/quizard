define(function(require) {
  var Dispatcher = require('core/dispatcher');
  var K = require('constants');
  var _ = require('underscore');
  var pick = _.pick;

  return {
    /**
     * Update Quizard settings.
     *
     * @param {Object} settings
     * @param {String} [settings.apiHost="/api/v1"]
     *        Full URL to where Canvas can be located.
     *
     */
    save: function(settings) {
      return Dispatcher.dispatch(K.SETTINGS_SAVE, pick(settings || {}, [
        'apiHost'
      ]));
    }
  };
});