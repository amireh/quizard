localStorage.clear();

require([ 'jquery', 'config' ], function($, Config) {
  $('<div id="app" />').appendTo(document.body);

  Config.xhr.timeout = 50;

  $.ajaxPrefilter('*', function(options) {
    console.info('XHR request: [' + options.type + ']', options.url);
  });

  require([ 'config/initializer' ], function(init) {
    init().then(launchTests);
  });
});