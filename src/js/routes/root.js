define(function(require) {
  var ApplicationRoute = require('core/application_route');
  var React = require('react');
  var RSVP = require('rsvp');
  var RootLayout = require('jsx!views/layouts/root');
  var SessionStore = require('stores/sessions');
  var AccountStore = require('stores/accounts');
  var OperationStore = require('stores/operations');
  var RouteActions = require('actions/routes');

  return new ApplicationRoute('root', {
    container: document.body,

    ready: function(callback) {
      this.applicationLayout.promise.then(callback);
    },

    isAuthenticated: function() {
      return SessionStore.isActive();
    },

    model: function() {
      if (this.isAuthenticated()) {
        return AccountStore.fetch();
      } else {
        return RSVP.resolve();
      }
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

      this.reload().finally(RouteActions.home).finally(function() {
        update({ transitioning: false });
      });
    },

    enter: function() {
      var layout = React.renderComponent(RootLayout(), this.container);

      this.applicationLayout.resolve(layout);

      SessionStore.addChangeListener(this.switchAuthStates, this);
      AccountStore.addChangeListener(this.updateProps, this);
      OperationStore.addChangeListener(this.updateProps, this);

      this.updateProps();
    },

    updateProps: function(props) {
      props = props || {};
      props.authenticated = SessionStore.isActive();
      props.user = SessionStore.get();
      props.accounts = AccountStore.getAll();
      props.activeAccountId = AccountStore.getActiveAccountId();
      props.operation = OperationStore.toProps();

      this.events.update.call(this, props);
    }
  });
});