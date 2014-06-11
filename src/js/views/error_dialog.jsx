/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var Dialog = require('jsx!components/dialog');
  var ErrorDialog = React.createClass({
    getInitialState: function() {
      return {
        error: null
      };
    },

    componentDidMount: function() {
      var error = this.props.error;
      this.setState({ error: this.extractErrorMessage(this.props.error) });
    },

    render: function() {
      return(
        <Dialog scrollable onClose={this.props.onClose} title="Internal Error">
          <p>
            Something has gone wrong, most likely an issue with Quizard.
            Error details should follow below if I was able to figure it out.
          </p>

          <pre>{this.state.error}</pre>
        </Dialog>
      );
    },

    extractErrorMessage: function(error) {
      var prettyPrint = function(json) {
        return JSON.stringify(json, undefined, 2);
      };

      if (error instanceof Error) {
        return prettyPrint({
          name: error.name,
          message: error.message,
          stack: error.stack
        }, undefined, 2);
      }
      else if (typeof error === 'string') {
        return error;
      }
      // Uncaught API errors?
      else if (error.responseJSON) {
        return prettyPrint(error.responseJSON);
      }
      else {
        return prettyPrint(error);
      }
    }
  });

  return ErrorDialog;
});