define(function(require) {
  var PixyJasmine = require('pixy-jasmine');
  var K = require('constants');
  var Store = require('stores/settings');
  var ajax = require('core/ajax');

  describe('Stores.Settings', function() {
    var onChange, onError;
    var listener = {
      onChange: function(value) { return value; },
      onError: function(error) { throw error; }
    };

    beforeEach(function() {
      onChange = spyOn(listener, 'onChange').and.callThrough();
      onError = spyOn(listener, 'onError').and.callThrough();
    });

    afterEach(function() {
      Store.reset();
    });

    describe('Changing settings [SETTINGS_SAVE]', function() {
      describe('[apiHost]', function() {
        this.promiseSuite = true;
        this.serverSuite = {
          trackRequests: true
        };

        it('should update the api host', function() {
          Store.onAction(K.SETTINGS_SAVE, {
            apiHost: '/foo/bar'
          }, onChange, onError);

          expect(onError).not.toHaveBeenCalled();
          expect(onChange).toHaveBeenCalled();

          ajax({ url: '/test' });

          expect(this.requests[0].url).toEqual('/foo/bar/test');
        });
      }); // [apiHost]

    }); // [SETTINGS_SAVE]
  });
});