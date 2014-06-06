define([ 'ext/pixy', 'stores/app', 'stores/sessions', 'constants' ],
function(Pixy, AppStore, SessionStore, K) {
  var RouteActions;
  var router = Pixy.ApplicationRouter;
  var dispatcher = Pixy.Dispatcher;

  function transitionTo(destination) {
    return router.transitionTo(destination);
  }

  function goToDestinationOrHome(destination) {
    if (destination) {
      console.debug('RouteActions:\tdestination:', destination);
      return transitionTo(destination).followRedirects().catch(RouteActions.home);
    } else {
      console.debug('RouteActions:\tdestination unavailable, going back home.');
      return RouteActions.home();
    }
  }

  RouteActions = {
    /**
     * Transition back to the previous primary view.
     */
    back: function() {
      console.debug('RouteActions: going back.');
      return goToDestinationOrHome(AppStore.previousPrimaryRoute());
    },

    home: function() {
      var destination = SessionStore.isActive() ?
        K.DEFAULT_PRIVATE_ROUTE :
        K.DEFAULT_PUBLIC_ROUTE;

      console.debug('RouteActions: going home.');

      return transitionTo(destination).promise;
    },

    /**
     * Transition back to the current primary view, assuming we're in a
     * secondary one.
     */
    backToPrimaryView: function() {
      console.debug('RouteActions: going back to primary route.');
      return goToDestinationOrHome(AppStore.currentPrimaryRoute());
    },

    trackRoute: function(url, layer) {
      dispatcher.dispatch(K.APP_TRACK_ROUTE, {
        route: url || '/',
        layer: layer
      });
    }
  };

  return RouteActions;
});