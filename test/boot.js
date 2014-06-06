localStorage.clear();

require([ 'jquery' ], function($) {
  $('<div id="app" />').appendTo(document.body);

  require([ 'config/initializer' ], function() {
    launchTests();
  });
});