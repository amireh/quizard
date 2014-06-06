require([
  'ext/pixy',
  'stores/sessions',
  'bundles/core',
  'bundles/stores',
  'config/initializer',
  'config/initializers/routes'
],
function(Pixy, SessionStore) {
  SessionStore.fetch({ markUnconditionally: true }).catch(function() {
    return true;
  }).then(function() {
    // Start the routing engine
    return Pixy.ApplicationRouter.start({
      pushState: false,
      preload: true
    });
  });
});