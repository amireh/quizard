define([ 'pixy', 'constants', 'actions/routes' ],
function(Pixy, K, RouteActions) {
  var router = Pixy.ApplicationRouter;

  function isSecondary(route) {
    return route.isSecondary;
  }

  function routeLayer(route) {
    return isSecondary(route) ? K.APP_SECONDARY_LAYER : K.APP_PRIMARY_LAYER;
  }

  function forwardRouteChange(transition) {
    var layer;
    var targetHandler;
    var targetName = transition.targetName;

    if (!router.hasRoute(targetName)) {
      console.warn('No route handler for:', targetName, '. can not track route change.');
      return;
    }

    targetHandler = router.getHandler(targetName);
    layer = routeLayer(targetHandler);

    RouteActions.trackRoute(targetName, layer);
  }

  return {
    enter: function() {
      forwardRouteChange(router.activeTransition);
    },

    exit: function() {
      if (isSecondary(this)) {
        RouteActions.trackRoute(undefined, K.APP_SECONDARY_LAYER);
      }
    }
  };
});