define([
  'config/initializers/i18next',
  'config/initializers/jquery',
  'config/initializers/pixy',
  'config/initializers/moment',
  'config/initializers/pikaday',
  'chosen',
  'ext/array',
  //>>excludeStart("production", pragmas.production);
  , 'config/initializers/debug'
  //>>excludeEnd("production");
], function(loadLocale) {
  return loadLocale;
});