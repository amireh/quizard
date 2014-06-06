/** @jsx React.DOM */
define([
  'ext/react',
  'jsx!components/dialog',
  'jsx!components/save_button',
  'actions/sessions'
], function(React, Dialog, SaveButton, SessionActions) {
  var LoginDialog = React.createClass({
    mixins: [
      React.addons.LinkedStateMixin,
      React.mixins.FormErrors,
      React.mixins.ActionInitiator
    ],

    getInitialState: function() {
      return {
        apiToken: null
      };
    },

    onStoreError: function(storeError) {
      this.refs.saveButton.markDone(false);
      this.showFormError({
        fieldErrors: {
          apiToken: {
            code: undefined,
            message: storeError.error.errors[0].message
          }
        }
      });
    },

    render: function() {
      return(
        <Dialog
          onClose={this.props.onClose}
          title='Sign in to Canvas'
          autoFocus='[name="apiToken"]'
          closable={false}
          thin={true}>

          <p>Fill in your Canvas API token to proceed.</p>

          <form ref="form" onSubmit={this.login} noValidate className="vertical-form">
            <input
              type="text"
              name="apiToken"
              placeholder="Your API token"
              autoFocus={true}
              valueLink={this.linkState('apiToken')}
              className="form-input" />

            <SaveButton
              ref="saveButton"
              onClick={this.login}
              className="primary"
              overlay={true}
              paddedOverlay={true}>
              Log In
            </SaveButton>
          </form>
        </Dialog>
      );
    },

    login: function() {
      this.trackAction(SessionActions.create(this.state.apiToken));
    }
  });

  return LoginDialog;
});