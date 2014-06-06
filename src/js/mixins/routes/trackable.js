define([
  'pixy', 'constants', 'actions/routes'
], function(Pixy, K, RouteActions) {
  var router = Pixy.ApplicationRouter;

  function isSecondary(route) {
    return route.isSecondary;
  }

  function routeLayer(route) {
    return isSecondary(route) ? K.APP_SECONDARY_LAYER : K.APP_PRIMARY_LAYER;
  }

  function forwardRouteChange(transition, layer) {
    RouteActions.trackRoute(transition.targetName, layer);
  }

  return {
    enter: function() {
      forwardRouteChange(router.activeTransition, routeLayer(this));
    },
    exit: function() {
      if (isSecondary(this)) {
        RouteActions.trackRoute(undefined, K.APP_SECONDARY_LAYER);
      }
    }
  };
});