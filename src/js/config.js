define([
  'underscore',
  'config/environments/production',
  'config/environments/development'
], function(_, ProductionConfig, DevelopmentConfig) {
  var config = ProductionConfig || {};

  //>>excludeStart("production", pragmas.production);
  _.merge(config, DevelopmentConfig || {});
  //>>excludeEnd("production");

  return config;
});
