/** @jsx React.DOM */
define([
  'ext/react',
  'actions/users',
  'jsx!components/save_button',
  'jsx!components/alert',
], function(React, UserActions, SaveButton, Alert) {
  var UserEnroll = React.createClass({
    mixins: [
      React.addons.LinkedStateMixin,
      React.mixins.ActionInitiator
    ],

    getInitialState: function() {
      return {
        email: undefined,
        name: undefined,
        password: undefined
      };
    },

    onStoreError: function() {
      this.refs.saveButton.markDone(false);
    },

    render: function() {
      return(
        <div>
          {this.state.storeError &&
            <Alert
              onDismiss={this.clearStoreError}
              className="alert-danger">{this.state.storeError.error}</Alert>
          }
          <form onSubmit={this.createUser} className="vertical-form">
            <input
              type="text"
              name="name"
              placeholder="A name for the user"
              autoFocus={true}
              ref="autoFocusNode"
              valueLink={this.linkState('name')}
              className="form-input" />

            <input
              type="text"
              name="email"
              placeholder="An email"
              valueLink={this.linkState('email')}
              className="form-input" />

            <input
              type="password"
              name="password"
              placeholder="Some password"
              valueLink={this.linkState('password')}
              className="form-input" />

            <SaveButton
              ref="saveButton"
              onClick={this.createUser}
              className="primary"
              overlay={true}
              paddedOverlay={true}>
              Create User
            </SaveButton>
          </form>
        </div>
      );
    },

    createUser: function() {
      var service = UserActions.create(this.state.name, this.state.email, this.state.password);

      this.setState({
        actionIndex: service.actionIndex
      });
    }
  });

  return UserEnroll;
});