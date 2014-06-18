require([
  'pixy',
  'config/initializer',
  'stores/sessions',
  'bundles/core',
  'bundles/stores',
  'config/initializers/routes'
],
function(Pixy, loadLocale, SessionStore) {
  loadLocale().then(function() {
    return SessionStore.fetch().catch(function() {
      return true;
    });
  }).then(function() {
    // Start the routing engine
    return Pixy.ApplicationRouter.start({
      locale: 'en',
      pushState: false,
      preload: true
    });
  });
});