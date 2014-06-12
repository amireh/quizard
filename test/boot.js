localStorage.clear();

require([ 'jquery', 'config' ], function($, Config) {
  $('<div id="app" />').appendTo(document.body);

  Config.xhr.timeout = 50;

  require([ 'config/initializer' ], function() {
    launchTests();
  });
});