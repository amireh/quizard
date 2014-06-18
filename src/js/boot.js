require([
  'pixy',
  'config/initializer',
  'stores/sessions',
  'bundles/stores',
  'config/initializers/routes'
],
function(Pixy, loadLocale, Session) {
  loadLocale().then(Session.fetch.bind(Session)).finally(function() {
    // Start the routing engine
    return Pixy.ApplicationRouter.start({
      locale: 'en',
      pushState: false,
      preload: true
    });
  });
});