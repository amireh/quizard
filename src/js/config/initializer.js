define([
  'config/initializers/i18next',
  'config/initializers/jquery',
  'config/initializers/pixy',
  //>>excludeStart("production", pragmas.production);
  , 'config/initializers/debug'
  //>>excludeEnd("production");
], function(loadLocale) {
  return loadLocale;
});