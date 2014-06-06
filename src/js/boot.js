require([
  'ext/pixy',
  'stores/sessions',
  'bundles/core_bundle',
  'bundles/store_bundle',
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