define([
  'pixy',
  'rsvp',
  'constants',
  'actions/routes'
], function(Pixy, RSVP, K, RouteActions) {

  return Pixy.Route.extend({
    /**
     * @property {RSVP.Promise} applicationLayout
     *
     * The RootLayout once it's been mounted.
     */
    applicationLayout: RSVP.defer(),

    events: {
      /**
       * Render a component into a layout region.
       *
       * @param {React.Class} component
       *
       * @param {Object} options
       *
       * @param {String} [options.into="main"]
       *        The region to mount the component in.
       *
       * @param {String} [options.outlet="content"]
       *        The region outlet to mount the component in.
       */
      render: function(component, layoutName, options) {
        options = options || {};

        this.get('applicationLayout', function(layout) {
          try {
            layout.add(component, layoutName, options);
          } catch(e) {
            console.warn('Failed to update layout props:');
            console.warn(e.stack);

            // TODO: inject the error and present it somehow
          }
        });
      },

      update: function(props) {
        this.get('applicationLayout', function(layout) {
          layout.setProps(props);
        });
      },

      /**
       * Remove a previously-rendered component from the layout.
       *
       * @param {React.Class} component
       *
       * @param {Object} options
       *
       * @param {String} [options.from="main"]
       *        The region you mounted the component in. Not specifying the
       *        correct region will cause an error to be thrown.
       *
       */
      remove: function(component, layoutName, options) {
        options = options || {};

        this.get('applicationLayout', function(layout) {
          layout.remove(component, layoutName, options);
        });
      },

      storeError: function(error) {
        this.get('applicationLayout', function(layout) {
          layout.setProps({ storeError: error });
        });
      },

      error: function(error, transition) {
        var targetHandler;

        console.warn(Array(80).join('*'));
        console.warn('AppRoute received an error:');
          console.warn('\tError:', error);
          console.warn('\tTransition:', transition);
        console.warn(Array(80).join('*'));

        if (error && error.status === 401) {
          error = K.ERROR_ACCESS_UNAUTHORIZED;
        }

        switch(error) {
          case K.ERROR_ACCESS_UNAUTHORIZED:
            this.transitionTo('/login');
          break;

          case K.ERROR_ACCESS_OVERAUTHORIZED:
            targetHandler = transition.router.getHandler(transition.targetName);

            if (targetHandler.isSecondary) {
              RouteActions.backToPrimaryView();
            } else {
              RouteActions.back();
            }
          break;
          default:
            var promise;

            if (!transition.pivotHandler) {
              promise = RouteActions.home();
            } else {
              promise = transition.promise;
            }

            promise.finally(function() {
              this.events.update.call(this, { error: error, loading: false });
            }.bind(this));
        }

        return false;
      },

      loading: function(state) {
        this.events.update.call(this, {
          loading: state
        });
      }
    }
  });
});