/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var Dialog = require('jsx!components/dialog');
  var Operation = require('jsx!components/operation_tracker');
  var OperationActions = require('actions/operations');
  var Alert = require('jsx!components/alert');
  var t = require('i18n!operations');

  var OperationBox = React.createClass({
    getInitialState: function() {
      return {
        error: undefined
      };
    },

    getDefaultProps: function() {
      return {
        operation: {}
      };
    },

    componentWillReceiveProps: function(nextProps) {
      if (nextProps.operation.error) {
        this.setState({ error: nextProps.operation.error });
      }
    },

    componentDidMount: function() {
      this.setState({ title: document.title });
    },

    componentDidUpdate: function() {
      var completion = parseInt(this.props.operation.ratio || 0, 10);

      if (completion < 100) {
        this.updateTitle('[' + completion + '%]');
      } else {
        this.resetTitle();
      }
    },

    componentWillUnmount: function() {
      this.resetTitle();
    },

    updateTitle: function(prefix) {
      document.title = prefix + ' ' + this.state.title;
    },

    resetTitle: function() {
      document.title = this.state.title;
    },

    getError: function() {
      if (this.state.error) {
        return t.htmlSafe([
          this.props.operation.name,
          'errors',
          this.state.error
        ].join('.'), this.props.operation.item);
      }
    },

    clearError: function() {
      this.setState({ error: undefined });
    },

    render: function() {
      var operation = this.props.operation;
      var error = this.getError();
      var title = React.DOM.span({
        dangerouslySetInnerHTML: { __html: operation.title }
      });

      return(
        <Dialog title={title} onClose={this.minimize}>
          {error &&
            <Alert
              onDismiss={this.clearError}
              className="alert-danger"
              children={error} />
          }

          {Operation(operation)}
        </Dialog>
      );
    },

    minimize: function() {
      OperationActions.minimize();
    }
  });

  return OperationBox;
});