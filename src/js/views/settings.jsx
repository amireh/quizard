/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var Dialog = require('jsx!components/dialog');
  var Actions = require('actions/settings');

  var Settings = React.createClass({
    mixins: [ React.addons.LinkedStateMixin ],

    getInitialState: function() {
      return {
        apiHost: null
      };
    },

    getDefaultProps: function() {
      return {
        settings: {
          apiHost: ''
        }
      };
    },

    componentWillReceiveProps: function(nextProps) {
      this.setState({ apiHost: nextProps.settings.apiHost });
    },

    render: function() {
      var settings = this.props.settings;

      return (
        <Dialog
          title="Quizard Settings"
          onClose={this.props.onClose}
          autoFocus=".form-input"
          footer={this.renderFooter()}>

          <form onSubmit={this.save} className="vertical-form">
            <label className="form-label">
              Canvas URL

              <input
                className="form-input"
                type="text"
                autoFocus
                valueLink={this.linkState('apiHost', settings.apiHost)} />
            </label>

            <p className="form-hint">
              This should point to the full url where your Canvas
              instance can be reached, like <code>http://localhost:3000</code>.
            </p>
          </form>
        </Dialog>
      );
    },

    renderFooter: function() {
      return (
        <button onClick={this.saveAndClose} className="btn btn-success">
          Save
        </button>
      );
    },

    save: function(e) {
      e.preventDefault();

      Actions.save({
        apiHost: this.state.apiHost
      });
    },

    saveAndClose: function(e) {
      this.save(e);
      this.props.onClose(e);
    }
  });

  return Settings;
});