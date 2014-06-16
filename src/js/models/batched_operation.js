define(function(require) {
  var Pixy = require('pixy');
  var RSVP = require('rsvp');
  var K = require('constants');
  var uid = 0;

  // Process a single operation.
  //
  // @private
  var runOne = function(runner, context, onDone, onError) {
    var rc;
    var service = RSVP.defer();

    // An escape hatch to abort the operation as soon as a runner fails, or to
    // recover from the error and proceed.
    var delegateError = function(error) {
      onError(error, context, service.resolve, service.reject);
    };

    try {
      rc = runner(context);
    }
    catch (error) {
      rc = RSVP.reject(error);
    }
    finally {
      rc.then(function(output) {
        RSVP.Promise.cast(onDone(output, context)).then(service.resolve);
      }, delegateError);
    }

    return service.promise;
  };

  var BatchedOperation = Pixy.Object.extend({
    defaults: {
      onDone: function(/*output, context*/) {},
      onError: function(error, context, resolve, reject) {
        return reject();
      }
    },

    initialize: function(options) {
      this.options = {
        runner: options.runner,
        onDone: options.onDone || this.defaults.onDone,
        onError: options.onError || this.defaults.onError,
        setup: options.setup
      };

      if (!this.options.runner) {
        throw "Must define a #runner function for a BatchedOperation.";
      }
    },

    /**
     * Run the batched operation with a given set of parameters.
     *
     * @return {Object}
     *         A descriptor for *this* run of the batched operation.
     *
     * @return {String} return.id
     *         A unique id among all batched operation runs that identifies this
     *         run.
     *
     * @return {RSVP.Promise} return.promise
     *         Resolves when all the runners are done, regardless of status.
     *
     * @return {Function} return.abort
     *         An escape hatch for preemptively aborting the operation.
     */
    run: function(runCount, context) {
      var aborted;
      var service = RSVP.defer();
      var runnerIndex = 0;
      var runner = this.options.runner;
      var onDone = this.options.onDone;
      var onError = this.options.onError;
      var abort = function(statusCode, error) {
        aborted = true;

        service.reject({
          code: statusCode,
          detail: error
        });
      };

      runCount = parseInt(runCount, 10);

      console.info('Engaging batched operation, doing', runCount, 'runs.');

      if (this.options.setup) {
        this.options.setup(context);
      }

      (function chainRunners() {
        if (aborted) {
          console.warn('Operation had been aborted, ignoring runners past', runnerIndex);
          return;
        }
        else if (runnerIndex === runCount) {
          return service.resolve();
        }

        ++runnerIndex;

        return runOne(runner, context, onDone, onError).then(function() {
          return chainRunners();
        }, function(error) {
          console.warn('Aborting batched operation.', error);
          abort(K.OPERATION_FAILED, error);
        });
      })();

      return {
        id: (++uid) + '',

        promise: service.promise,

        /**
         * Stop as soon as the current operation is finished.
         *
         * @return {RSVP.Promise}
         */
        abort: abort.bind(null, K.OPERATION_ABORTED),

        then: service.promise.then.bind(service.promise)
      };
    }
  });

  return BatchedOperation;
});