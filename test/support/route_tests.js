/* global jasmine: false */

require([ 'router', 'rsvp', 'backburner' ], function(Router, RSVP, Backburner) {
  var router;
  var url;

  /** @internal RSVP async config method before we modify it */
  var oldAsync, oldOnError;

  var bb = new Backburner['Backburner'](['promises']);

  RSVP.configure('onerror', function(e) {
    console.error(e);
    throw e;
  });

  /**
   * @private
   */
  function customAsync(callback, promise) {
    bb.defer('promises', promise, callback, promise);
  }

  /**
   * @private
   */
  function flushBackburner() {
    bb.end();
    bb.begin();
  }

  /** @private */
  function setup(options) {
    oldAsync = RSVP.configure('async');

    RSVP.configure('async', customAsync);

    bb.begin();

    router = new Router['default']();
    router.updateURL = function(inURL) {
      url = inURL;
    };

    router.getHandler = options.getHandler;

    if (options.setup) {
      options.setup(router);
    }

    extendDSL(this);
  }

  /** @private */
  function teardown() {
    RSVP.configure('async', oldAsync);

    router = url = undefined;
  }

  function extendDSL(suite) {
    Object.defineProperty(suite, 'router', {
      get: function() { return router; }
    });

    Object.defineProperty(suite, 'url', {
      get: function() { return url; }
    });

    suite.transitionTo = function() {
      router.transitionTo.apply(router, arguments);
      flushBackburner();
    }
  }

  /**
   */
  var RouteSuite = function(testSuite, options) {
    if (!options.getHandler) {
      throw "You must define a #getHandler function in options.";
    }

    testSuite.__routeSuiteSetup = true;
    testSuite.beforeEach(function() {
      setup.call(this, options);
    });
    testSuite.afterEach(teardown);

    return this;
  };

  Object.defineProperty(jasmine.Suite.prototype, 'routeSuite', {
    set: function(options) {
      if (this.__routeSuiteSetup) {
        return;
      }

      RouteSuite(this, options || {});
    }
  });
});
