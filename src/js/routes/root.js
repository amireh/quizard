define(function(require) {
  var ApplicationRoute = require('core/application_route');
  var React = require('react');
  var RootLayout = require('jsx!views/layouts/root');
  var SessionStore = require('stores/sessions');
  var RouteActions = require('actions/routes');

  return new ApplicationRoute('root', {
    container: document.body,

    ready: function(callback) {
      this.applicationLayout.promise.then(callback);
    },

    isAuthenticated: function() {
      return SessionStore.isActive();
    },

    /**
     * @private
     *
     * Transitions to and from the guest status to member status by changing
     * the app layout and redirecting to the appropriate landing page.
     */
    switchAuthStates: function() {
      var update = this.updateProps.bind(this);

      update({ transitioning: true });

      RouteActions.home().finally(function() {
        update({ transitioning: false });
      });
    },

    enter: function() {
      var layout = React.renderComponent(RootLayout(), this.container);

      this.applicationLayout.resolve(layout);

      this.listenTo(SessionStore, 'change', this.switchAuthStates);
      this.updateProps();
    },

    exit: function() {
      SessionStore.removeChangeListener(null, this);
    },

    updateProps: function(props) {
      props = props || {};
      props.authenticated = SessionStore.isActive();
      props.user = SessionStore.get();

      this.events.update.call(this, props);
    }
  });
});