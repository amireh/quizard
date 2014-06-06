define([
  'ext/pixy', 'bundles/routes', 'constants', 'rsvp'
], function(Pixy, RouteBundle, K, RSVP) {
  'use strict';

  var router = Pixy.ApplicationRouter;

  RouteBundle.setup(router);

  router.getHandler = function(name) {
    var handler = RouteBundle.routeMap[name];

    if (!handler) {
      router.trigger('error', K.ERROR_NOT_FOUND);
      return RSVP.reject(K.ERROR_NOT_FOUND);
    }

    return RouteBundle.routeMap[name];
  };
});