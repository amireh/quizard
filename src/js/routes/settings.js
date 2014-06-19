define(function(require) {
  var Route = require('routes/secondary');
  var View = require('jsx!views/settings');
  var Settings = require('stores/settings');

  new Route('settings', {
    windowTitle: 'Settings - Quizard',
    views: [{
      component: View,
      into: 'dialogs'
    }],

    enter: function() {
      Settings.addChangeListener(this.updateProps, this);
      this.updateProps();
    },

    updateProps: function() {
      this.update({
        settings: Settings.toProps()
      });
    }
  });
});