define([ 'ext/pixy', 'underscore', 'constants', 'moment', 'config' ],
function(Pixy, _, Constants, moment, Config) {
  var store;
  var primaryRoute;
  var previousPrimaryRoute;
  var secondaryRoute;
  var clone = _.clone;
  var dateRange = {
    from: moment.utc().startOf('month'),
    to: moment.utc().endOf('month'),
    format: Config.defaultPreferences.user.dateFormat
  };

  /**
   * @internal
   * The current route and its layer.
   */
  var currentRouteInfo = {
    route: null,
    layer: null
  };

  /**
   * @internal
   * The previous route and its layer.
   */
  var previousRouteInfo = clone(currentRouteInfo);

  /**
   * Set a new route to the current one.
   *
   * @param {Object} payload
   *
   * @param {String} payload.layer (required)
   *        Either APP_PRIMARY_LAYER or APP_SECONDARY_LAYER.
   *
   * @param {String} payload.route (required)
   *        The route.
   */
  function trackRouteChanges(payload, onChange) {
    console.debug('Route change:', payload.route, '[', payload.layer, ']');

    previousRouteInfo = clone(currentRouteInfo);

    currentRouteInfo = {
      route: payload.route,
      layer: payload.layer
    };

    if (payload.layer === Constants.APP_PRIMARY_LAYER) {
      previousPrimaryRoute = primaryRoute;
      primaryRoute = payload.route;
    }
    else if (payload.layer === Constants.APP_SECONDARY_LAYER) {
      secondaryRoute = payload.route;
    }

    onChange();
  }

  /**
   * Update the date-range that affects the resources loaded.
   *
   * @param {Object} payload  [description]
   *
   * @param {String} payload.from (required)
   * @param {String} payload.to (required)
   * @param {String} payload.format
   */
  function setDateRange(payload, onChange/*, onError*/) {
    var from, to, format, valid;

    if (!dateRange) {
      dateRange = {};
    }

    format = payload.format || dateRange.format;
    from = moment.utc(payload.from, format);
    to = moment.utc(payload.to, format);

    valid = to.isSame(from) || to.isAfter(from);

    if (!valid) {
      return onError();
    }

    if (from.isSame(dateRange.from) && to.isSame(dateRange.to)) {
      return;
    }

    dateRange.from = from;
    dateRange.to = to;
    dateRange.format = format;

    onChange('dateRange', dateRange);
  }

  /**
   * @class Stores.App
   *
   * Storage for app-wide state like the route history.
   */
  store = new Pixy.Store('AppStore', {
    /**
     * The current route.
     *
     * @return {Object} routeInfo
     * @return {String} routeInfo.route
     *         The URL.
     * @return {String} routeInfo.layer
     *         The layer in which the route's view resides.
     */
    currentRouteInfo: function() {
      return currentRouteInfo;
    },

    /**
     * Like #currentRouteInfo but for the immediate previous route.
     */
    previousRouteInfo: function() {
      return previousRouteInfo;
    },

    /**
     * @return {String}
     *         URL of the route currently occupying the primary layer.
     */
    currentPrimaryRoute: function() {
      return primaryRoute;
    },

    /**
     * @return {String}
     *         URL of the last route that occupied the primary layer.
     */
    previousPrimaryRoute: function() {
      return previousPrimaryRoute;
    },

    /**
     * @return {String}
     *         URL of the current route occupying the secondary layer, e.g, a
     *         dialog route.
     */
    currentSecondaryRoute: function() {
      return secondaryRoute;
    },

    dateRange: function() {
      var format = dateRange.format;

      return {
        from: dateRange.from.format(format),
        to: dateRange.to.format(format),
        format: format
      };
    },

    onAction: function(action, payload, onChange, onError) {
      switch(action) {
        case Constants.APP_TRACK_ROUTE:
          trackRouteChanges(payload, onChange);
        break;
        case Constants.APP_SET_DATE_RANGE:
          setDateRange(payload, onChange, onError);
        break;
      }
    }
  });

  return store;
});