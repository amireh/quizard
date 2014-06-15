define(function(require) {
  var BatchedOperation = require('models/batched_operation');
  var RSVP = require('rsvp');

  describe('Models.BatchedOperation', function() {
    this.promiseSuite = true;

    describe('should engage a runner many times', function() {
      var onBananaEaten = jasmine.createSpy();

      beforeEach(function(done) {
        var flush = this.flush.bind(this);
        var eatBanana = function() {
          var svc = RSVP.defer();

          setTimeout(function() {
            svc.resolve();
            flush();
          }, 25);

          return svc.promise;
        };

        var eatBananas = new BatchedOperation({
          runner: function() {
            return eatBanana().then(function() {
              onBananaEaten();
            });
          }
        });

        eatBananas.run(5);

        setTimeout(done, 150);
      });

      it('runs them sequentially', function() {
        expect(onBananaEaten).toHaveBeenCalled();
        expect(onBananaEaten.calls.count()).toEqual(5);
      });
    });

    it('should abort if #onError says so', function() {
      var onBananaEaten = jasmine.createSpy();
      var i = 0;
      var eatBanana = function() {
        if (i === 3) {
          throw 'error';
        }

        ++i;

        return RSVP.resolve();
      };

      var eatBananas = new BatchedOperation({
        runner: function() {
          return eatBanana().then(function() {
            onBananaEaten();
          });
        },
        onError: function(error, context, resolve, reject) {
          reject();
        }
      });

      eatBananas.run(5);
      this.flush();

      expect(onBananaEaten.calls.count()).toEqual(3);
    });

    it('should resume if #onError handles an error', function() {
      var onBananaEaten = jasmine.createSpy();
      var i = 0;
      var eatBanana = function() {
        ++i;

        if (i === 2) {
          throw 'someError';
        }

        return RSVP.resolve();
      };

      var eatBananas = new BatchedOperation({
        runner: function() {
          return eatBanana().then(function() {
            onBananaEaten();
          });
        },
        onError: function(error, context, resolve, reject) {
          if (error === 'someError') {
            return resolve();
          }

          reject();
        }
      });

      eatBananas.run(5);
      this.flush();

      expect(onBananaEaten.calls.count()).toEqual(4);
    });

    it('should call me with the output of each runner', function() {
      var i = 0;
      var bananas = [];
      var eatBanana = function() {
        return RSVP.resolve('banana' + (++i));
      };

      var eatBananas = new BatchedOperation({
        runner: function() {
          return eatBanana();
        },
        onDone: function(output, context) {
          bananas.push(output);
        }
      });

      eatBananas.run(3);
      this.flush();
      expect(bananas).toEqual([ 'banana1', 'banana2', 'banana3' ])
    });

    it('should pass the context around to runners and callbacks', function() {
      var bananas = [];
      var eatBanana = function(id) {
        return RSVP.resolve('banana' + id);
      };

      var eatBananas = new BatchedOperation({
        runner: function(context) {
          return eatBanana(++context.id);
        },

        onDone: function(output) {
          bananas.push(output);
        }
      });

      eatBananas.run(3, { id: 0 });
      this.flush();
      expect(bananas).toEqual([ 'banana1', 'banana2', 'banana3' ])
    });
  });
});