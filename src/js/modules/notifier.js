define([ 'ext/underscore', 'ext/pixy', 'humane', 'when' ],
function(_, Pixy, humane, when, ConfirmationDialog) {
  'use strict';

  var Notifier = Pixy.Object.extend({
    module: 'notifier',

    message: function(text, options) {
      var messageRenderer = when.defer();

      humane.remove(function() {
        var log = humane.log(text, _.extend({}, {
          timeout: 5000,
          clickToClose: true
        }, options));

        messageRenderer.resolve(log);
      });

      return messageRenderer.promise;
    },

    info: function(text, options) {
      return this.message(text, _.extend({}, options, {
        addnCls: 'humane-libnotify-info'
      }));
    },

    success: function(text, options) {
      return this.message(text, _.extend({}, options, {
        addnCls: 'humane-libnotify-success'
      }));
    },

    warning: function(text, options) {
      return this.message(text, _.extend({}, options, {
        addnCls: 'humane-libnotify-warning'
      }));
    },

    error: function(text, options) {
      return this.message(text, _.extend({}, options, {
        addnCls: 'humane-libnotify-error'
      }));
    },

    confirm: function(message) {
      return new ConfirmationDialog().exec({ message: message });
    }
  });

  return new Notifier();
});