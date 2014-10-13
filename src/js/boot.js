require([
  'pixy',
  'config/initializer',
  'stores/settings',
  'stores/sessions',
  'bundles/stores',
  'bundles/recipes',
  'config/initializers/routes'
],
function(Pixy, loadLocale, Settings, Session) {
  Settings.load();

  loadLocale().then(Session.fetch.bind(Session)).finally(function() {
    // Start the routing engine
    // console.log('Booting...');
    return Pixy.ApplicationRouter.start({
      locale: 'en',
      pushState: false,
      preload: true
    });
  });
});