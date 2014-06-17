define([
  'config/initializers/i18next',
  'config/initializers/jquery',
  'config/initializers/pixy',
  'chosen',
  //>>excludeStart("production", pragmas.production);
  , 'config/initializers/debug'
  //>>excludeEnd("production");
], function(loadLocale) {
  return loadLocale;
});