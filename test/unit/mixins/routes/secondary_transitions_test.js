define([ 'mixins/routes/secondary_transitions', 'underscore', 'pixy' ],
function(Mixin, _, Pixy) {
  var extend = _.extend;

  describe('Mixins.Routes.SecondaryTransitions', function() {
    var handlers = {};
    var enterSpy;

    this.routeSuite = {
      setup: function(router) {
        function createRoute(name, secondary, proto) {
          handlers[name] = new Pixy.Route(name, extend({}, proto, {
            mixins: [ Mixin ],
            events: {
              willTransition: function(transition) {
                Mixin.events.willTransition.call(this, transition);
              }
            },
            isSecondary: secondary
          }), true);
        }

        createRoute('primaryRoute', false, {
          enter: function() {
            enterSpy();
          }
        });
        createRoute('secondaryRoute', true);
        createRoute('otherPrimaryRoute');

        router.map(function(match) {
          match('/primary').to('primaryRoute');
          match('/secondary').to('secondaryRoute');
          match('/otherPrimary').to('otherPrimaryRoute');
        });
      },

      getHandler: function(name) {
        return handlers[name];
      }
    };

    beforeEach(function() {
      enterSpy = jasmine.createSpy();
    });

    it('should install guards when transitioning to a secondary route', function() {      console.debug('going to primary');
      this.transitionTo('/primary');

      expect(enterSpy).toHaveBeenCalled();
      this.transitionTo('/secondary');

      this.transitionTo('/primary');
      expect(enterSpy.calls.count()).toEqual(1);
      expect(this.url).toEqual('/primary');
    });

    it('should release guards when transitioning to a different primary route', function() {
      this.transitionTo('/primary');
      this.transitionTo('/secondary');
      this.transitionTo('/otherPrimary');
      this.transitionTo('/primary');

      expect(enterSpy.calls.count()).toEqual(2);
    });

    it('should release guards when re-entering', function() {
      this.transitionTo('/primary');

      expect(enterSpy.calls.count()).toEqual(1);

      this.transitionTo('/secondary');
      this.transitionTo('/primary');

      expect(enterSpy.calls.count()).toEqual(1);

      this.transitionTo('/otherPrimary');
      this.transitionTo('/primary');

      expect(enterSpy.calls.count()).toEqual(2);
    });

    it('should release guards if transition is aborted');
    it('should release guards if redirected back to it');
    it('should return the correct context');
  });
});