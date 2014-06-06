/* global jasmine:false */

require([ 'rsvp' ], function(RSVP) {
  var promiseDescription;
  var promiseDelivered;

  /**
   * @private
   *
   * This is necessary for expectations that are wrapped inside #captureStackTrace
   * as the expectation callback will be invoked outside the current call stack
   * and jasmine might think the spec is complete before the callback is invoked.
   *
   * This variable is used in conjunction with #promiseDelivered inside the
   * promise delivery timer constraint to ensure that both the promise has been
   * delivered, and the expectations were run (afterwards).
   *
   * See #captureStackTrace
   */
  var expectationsCalled;

  /**
   * @private
   *
   * We have to hack into the prototype of When::Promise to add the ability to
   * chain our promise-related jasmine helpers for a very convenient interface.
   */
	var promisePrototype = RSVP.Promise.prototype;

  /**
   * @private
   *
   * When a promise-expectation callback is defined, it will be run inside the
   * promise scope and any error it raises will be considered as a promise error
   * and only catchable inside a promise.catch() or promise.ensure() block, which
   * is not correct in the context of the spec, as that callback may have syntax
   * or any sort of spec-logic error that's not related to the service.
   *
   * To avoid this, we run the expectations *outside* the promise stack (using
   * _.defer()) and then we have the benefit of catching spec errors which will
   * be thrown to the host environment (jasmine).
   *
   * We also ensure that jasmine picks up the expectations callback before the
   * spec execution is considered to be complete by some magic and hackery in
   * the WaitForDelivery elapsed timeout.
   *
   * @param  {Function} callback
   *         The spec expectations callback (to be called in in promise.then()
   *         or promise.otherwise() contexts.)
   *
   * @param  {jasmine.Spec/Object} thisArg
   *         The current spec, so the user can normally use any spec instance
   *         variables they've defined, or whatever context the promise callback
   *         is running in.
   *
   * @param  {arguments} params
   *         The `arguments` variable passed to the promise.then() callback.
   *
   * @example
   *
   *     it('should fulfill a service', function() {
   *       myPromise.then(function() {
   *         captureStackTrace(expectationsCallback, this, arguments);
   *       });
   *     })
   */
  function captureStackTrace(callback, thisArg, params) {
    expectationsCalled = false;

    _.defer(function() {
      if (callback) {
        callback.apply(thisArg, params);
      }

      expectationsCalled = true;
    });
  }

  /**
   * @private
   *
   * Ties a promise-based service to a timer that will fail the spec if it
   * elapses and the promise had not been delivered yet.
   *
   * The timer is set to elapse after 1 second.
   *
   * @param {Promise} promise
   *        A promise returned by a function call.
   *
   * @param {String} [operation='An async operation.']
   *        A description of the operation to display if it times out.
   *
   * @param {Integer} [duration=1000]
   *        Milliseconds to wait before elapsing the promise fulfillment timer.
   *
   * @return {Promise}
   *         The same promise that you passed in, so you can chain it.
   */
  function WaitForDelivery(promise, operation, duration) {
    var currentSpec = jasmine.getEnv().currentSpec;

    promiseDelivered = false;
    expectationsCalled = true;
    duration = duration || 1000;

    promiseDescription = operation;

    promise.ensure(function() {
      console.debug(
        'SPEC[' + currentSpec.description + ']: ' +
        'promise "' + operation + '" has been delivered.');

      promiseDelivered = true;
    });

    waitsFor(function() {
      return promiseDelivered && expectationsCalled;
    }, operation || 'An async operation', duration);

    return promise;
  }

  function parsePromiseException(promise) {
    var error = promise._detail;

    if (error instanceof Error) {
      console.error(error.stack);

      return {
        exception: error.stack
      };
    }

    return error;
  }

  /**
   * Wraps a promise with WaitForDelivery. This can be chainable in the promise
   * calls, see the example
   *
   * @param  {String} message
   *         Service description to pass to WaitForDelivery.
   *
   * @return {Promise}
   *         The promise.
   *
   * @example
   *
   *     it('should fulfill a service', function() {
   *       myObject.doService().then(function() {
   *         expect(myObject.serviceResult).toBeTruthy();
   *       }).otherwise(function() {
   *         // ...
   *       }).andWait('MyObject to perform the service X.');
   *     });
   */
  promisePrototype.andWait = function(message, ms) {
    return WaitForDelivery(this, message, ms);
  };

  /**
   * Wraps a promise with WaitForDelivery and runs your expectations based on
   * the fact that the promise should NOT be fulfilled.
   *
   * This also adds the benefit of automatically failing the spec if the promise
   * gets fulfilled, so you can focus only on writing the part that you're
   * interested in.
   *
   * @param  {Function} expectationsCallback
   *         A normal function where you run your expectations after the promise
   *         has been resolved as rejected.
   *
   * @return {Promise}
   *         The promise.
   *
   * @example
   *
   *     it('should reject a service request', function() {
   *       myObject.doService('bad_argument').shouldReject(function() {
   *         expect(myObject.serviceResult).toBeFalsy();
   *       }).andWait('MyObject to reject my service X request.');
   *     });
   */
  promisePrototype.shouldReject = function(expectationsCallback) {
    var that = this;

    return this.then(function(rc) {
      expect(that).toHaveBeenRejected(rc);
    }).otherwise(function() {
      captureStackTrace(expectationsCallback, this, arguments);
    });
  };


  /**
   * Wraps a promise with WaitForDelivery and runs your expectations based on
   * the fact that the promise should be fulfilled.
   *
   * This also adds the benefit of automatically failing the spec if the promise
   * gets rejected, so you can focus only on writing the part that you're
   * interested in.
   *
   * @param  {Function} expectationsCallback
   *         A normal function where you run your expectations after the promise
   *         has been fulfilled.
   *
   * @return {Promise}
   *         The promise.
   *
   * @example
   *
   *     it('should accept a service request', function() {
   *       myObject.doService('good argument').shouldFulfill(function() {
   *         expect(myObject.serviceResult).toBeTruthy();
   *       }).andWait('MyObject to fulfill my service X request.');
   *     });
   */
  promisePrototype.shouldFulfill = function(expectationsCallback) {
    var that = this;

    return this.then(function() {
      captureStackTrace(expectationsCallback, this, arguments);
    }).otherwise(function(error) {
      expect(that).toHaveBeenFulfilled([ error, parsePromiseException(that) ]);
    });
  };

  /** alias to shouldFulfill */
  promisePrototype.shouldResolve = promisePrototype.shouldFulfill;

  beforeEach(function() {
    promiseDelivered = false;
    expectationsCalled = true;

    this.addMatchers({
      toHaveBeenFulfilled: function(result) {
        var description = promiseDescription;

        if (result) {
          result = ' with: ' + JSON.stringify(result);
        }

        this.message = function() {
          return 'Expected promise of "' + description + '"' +
          'to have been fulfilled, but it was rejected' + (result||'') + '.';
        };

        return false;
      },

      toHaveBeenRejected: function(result) {
        var description = promiseDescription;

        if (result) {
          result = ' with: ' + JSON.stringify(result);
        }

        this.message = function() {
          return 'Expected promise of "' + description + '"' +
          'to have been rejected, but it was fulfilled' + (result||'') + '.';
        };

        return false;
      }
    });
  });
});
