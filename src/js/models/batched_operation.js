define(function(require) {
  var Pixy = require('pixy');
  var RSVP = require('rsvp');

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
        onError: options.onError || this.defaults.onError
      };

      if (!this.options.runner) {
        throw "Must define a #runner function for a BatchedOperation.";
      }
    },

    /**
     * Start processing the operations.
     *
     * @return {RSVP.Promise}
     *         Resolves when all the runners are done, regardless of status.
     */
    run: function(runCount, context) {
      var service = RSVP.defer();
      var runner = this.options.runner;
      var onDone = this.options.onDone;
      var onError = this.options.onError;
      var wasAborted = function() { return this.aborted; }.bind(this);
      var abort = this.abort.bind(this);
      var runnerIndex = 0;

      this.reset();

      console.info('Engaging batched operation, doing', runCount, 'runs.');

      (function chainRunners() {
        if (wasAborted()) {
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
          abort();
          service.reject(error);
        });
      })();

      return service.promise;
    },

    // Stop as soon as the current operation is finished.
    //
    // @return {RSVP.Promise}
    abort: function() {
      this.aborted = true;
    },

    /**
     * @internal
     */
    reset: function() {
      this.aborted = false;
    }
  });

  return BatchedOperation;
});