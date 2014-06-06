/* global sinon:false, jasmine: false */

require([ 'test/vendor/sinon-1.7.3' ], function() {

  /** @private */
  function startServer() {
    this.server = sinon.fakeServer.create();
    this.server.autoRespond = true;
  }

  /** @private */
  function stopServer() {
    this.server.restore();
    this.server = null;
  }

  /**
   * Creates a fake XHR server for each spec in the given suite. You can reach
   * the server instance INSIDE each spec by using `this.server` or by using the
   * instance() method in the returned object.
   *
   * @note
   * The server will be set to auto-respond automatically, so you won't have to
   * call sinon.server#respond() or anything.
   *
   * @param {Jasmine.TestSuite} testSuite
   *        Your `describe()` test suite.
   *
   * @example using the spec variable
   * describe('my suite', function() {
   *   Fixtures.ServerSpawner(this);
   *
   *   it('performs a server request', function() {
   *     this.server.respondWith(...);
   *   });
   * });
   *
   * @example
   *
   *     describe('my suite', function() {
   *       var servers = Fixtures.ServerSpawner(this);
   *
   *       it('performs a server request', function() {
   *         servers.instance().respondWith(...);
   *       });
   *     });
   */
  var ServerSpawner = function(testSuite) {
    testSuite._serverSpawnerInstalled = true;
    testSuite.beforeEach(startServer);
    testSuite.afterEach(stopServer);

    return this;
  };

  Object.defineProperty(jasmine.Suite.prototype, 'withFakeServer', {
    set: function(flag) {
      if (flag) {
        if (this._serverSpawnerInstalled) {
          return;
        }

        ServerSpawner(this);
      }
    }
  });

  jasmine.getEnv().serverSpawner = ServerSpawner;
});
