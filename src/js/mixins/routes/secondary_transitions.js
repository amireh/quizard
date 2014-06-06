define([ 'underscore' ], function(_) {
  'use strict';

  var pluck = _.pluck;
  var slice = Array.prototype.slice;

  /**
   * @internal Returning undefined will not interrupt execution of route/mixins.
   */
  var RC_PASS;

  /**
   * @internal Returning true will.
   */
  var RC_INTERRUPT = true;

  var ROUTE_PRIMARY = 1;
  var ROUTE_SECONDARY = 2;

  /**
   * @internal Set of routes that have been guarded.
   *
   * Need to keep track of these so we can release at the right time, see notes
   * on #willTransition.
   */
  var guarded;

  /** @internal */
  function log(router) {
    //>>excludeStart("production", pragmas.production);
    // var params;

    // params = slice.call(arguments);
    // params[0] = '[ST] ' + router.name + ':';

    // console.info.apply(console, params);
    //>>excludeEnd("production");
  }

  /** @internal */
  function isSecondary(route) {
    return route.isSecondary;
  }

  /** @internal */
  function isPrimary(route) {
    return !isSecondary(route);
  }

  /** @internal */
  function guard(route) {
    log(route, "transitioning to a secondary route, I won't re-load on next enter.");

    route._contextResolved = true;
    route._previousContext = route._context;
  }

  /** @internal */
  function isGuarded(route) {
    return route._contextResolved === true;
  }

  /**
   * @internal This method is re-entrant.
   */
  function release(route) {
    log(route, "releasing guards");

    route._contextResolved = route._context = route._previousContext = null;
  }

  /**
   * @class Routes.Mixins.SecondaryTransitions
   *
   * This mixin allows routes to be aware of "secondary" ones that should not
   * interrupt the life-cycle of the current, primary one.
   *
   * A route is considered secondary if it defines a "secondary" property
   * with a truthy value.
   *
   * The use case for this mixin is with dialog routes interrupting the
   * execution of the current base route. The expected behavior is that entering
   * a dialog route should not cause the base one to #exit(), and when the
   * dialog route exits, the base one should not need to restart its life-cycle
   * and re-resolve its models, etc.
   *
   * === Gotchas
   *
   * The mixin has a few assumptions about your route that you should probably
   * be aware of (and adhere to:)
   *
   *  - your model resolution happens in #model()
   *  - your setup and teardown routines happen in #enter() and #exit()
   *    respectively
   *
   * === Internals
   *
   * The mixin listens to the "willTransition" event, and checks the destination
   * route of the transition. If that's a secondary one, it will guard the
   * life-cycle hooks of the current route and all its parent up to the pivot
   * handler until the route is re-entered.
   *
   * Once re-entered, the mixin will release its guards and restore the route
   * to its normal behavior.
   *
   * The guards are released in the following situations:
   *
   *   - the route has transitioned to a secondary route, then was re-entered
   *   - the route has transitioned to a secondary route, which has transitioned
   *     to a different primary route
   *   - the route has transitioned to another primary route
   */
  return {

    /**
     * @private
     *
     * @return {Any} What-ever was returned in the last call to #model().
     */
    model: function() {
      if (isGuarded(this)) {
        log(this, "I'm considering myself already loaded.");
        return this._previousContext;
      }
    },

    /**
     * @private
     *
     * Cache the model resolved in #model(), because router.js discards the
     * context once the route is exited.
     */
    afterModel: function(model/*, transition*/) {
      if (isPrimary(this)) {
        this._context = model;
      }
    },

    /**
     * @private If guarded, interrupt this one call and then release the guards.
     */
    enter: function() {
      if (isGuarded(this)) {
        log(this, '\tblocking #enter');
        release(this);
        return RC_INTERRUPT;
      }
    },

    /**
     * @private
     */
    exit: function() {
      if (isGuarded(this)) {
        log(this, '\tblocking #exit');
        return RC_INTERRUPT;
      }
    },

    events: {
      willTransition: function(transition) {
        var router = transition.router;
        var targetHandler = router.getHandler(transition.targetName);
        var pivotHandler = transition.pivotHandler;

        // we're transitioning to a secondary route (case #1) so install the
        // guard and keep a reference to the guarded routes so we can handle
        // case #2
        if (isSecondary(targetHandler) && isPrimary(this)) {
          guarded = pluck(router.currentHandlerInfos, 'handler');
          guarded.forEach(guard);

          return RC_PASS;
        }

        // reset if we're transitioning to a primary route other than the one
        // we had guarded
        if (guarded && isPrimary(targetHandler) && !isGuarded(targetHandler)) {
          guarded.forEach(release);
          guarded.forEach(function(route) {
            // Don't call exit() on the pivot handler, it should never be exited
            // unless the router switches off.
            if (route !== pivotHandler) {
              route.exit();
            }
          });
          guarded = undefined;
        }
      }
    }
  };
});