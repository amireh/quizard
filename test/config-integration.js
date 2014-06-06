/* global requirejs: false, jasmine: false */
requirejs.config({
  callback: function() {
    // Avoid infinite loop in the pretty printer when trying to print objects with
    // circular references.
    jasmine.MAX_PRETTY_PRINT_DEPTH = 3;

    // Hide the global "launchTest" that the grunt-contrib-requirejs-template
    // unconditionally calls without respecting our callback. We must initialize
    // the app before any of the specs are run.
    var launchTests = this.launchTest;
    this.launchTest = function() {};
    var userInfo;
    var bootUp = function() {
      var server;
      var router = Pixy.Registry.get('applicationRouter');
      var viewport = Pixy.Registry.get('viewport');

      server = sinon.fakeServer.create();
      server.autoRespond = true;

      server.respondWith('GET', '/currencies', Fixtures.XHR(200, []));
      server.respondWith('GET', '/sessions', Fixtures.XHR(200, {id:1}));
      server.respondWith('GET', '/users/1', Fixtures.XHR(200, userInfo));
      server.respondWith('GET', '/users/1/accounts', Fixtures.XHR(200, []));
      server.respondWith('GET', '/users/1/categories', Fixtures.XHR(200, []));
      server.respondWith('GET', '/users/1/payment_methods', Fixtures.XHR(200, []));

      console.info("Logging in.");

      return router.session.fetch().then(function() {
        console.info("Firing up the viewport.");
        return viewport.start();
      }).then(function() {
        console.info("Firing up the router.");
        return router.start(false);
      }).then(function() {
        console.info("Restoring XHR.");
        // server.restore();
        // server = null;

        return true;
      });
    };

    // require([ 'test/main' ], function() {});
    require([ 'text!/www/index.html', 'json!fixtures/user' ], function(markup, jsonUser) {
      userInfo = jsonUser;

      markup = markup.substr(markup.search(/<body/));
      markup = markup.substr(0, markup.search('</body>')+7);

      document.body.outerHTML = markup;
      localStorage.clear();

      require([
        'config/initializer',
        'ext/pixy',
        'core/state',
        'core/application_router',
        'core/viewport',
        'core/session',
        'bundles/controller_bundle'
      ], function(initialize) {
        $.CORS({ host: '' });

        initialize().then(bootUp).then(launchTests);
      });
    });
  }
});