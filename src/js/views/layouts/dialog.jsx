/** @jsx React.DOM */
define(function(require) {
  var $ = require('jquery');
  var React = require('ext/react');
  var Actions = require('actions/routes');
  var OperationBox = require('jsx!./app/operation_box');

  var DialogLayout = React.createClass({
    mixins: [ React.addons.StackedLayoutMixin ],

    getDefaultProps: function() {
      return {
        onClose: this.closeDialog,
        operation: {}
      };
    },

    // We want the dialog layer to be visible only if a dialog is actually being
    // displayed, or the user is viewing an active operation.
    componentDidUpdate: function() {
      var hasDialog = !this.type.isEmpty(this.props);
      $(document.body).toggleClass('with-dialog', hasDialog ||
        this.isViewingOperation());
    },

    isViewingOperation: function() {
      return !this.props.operation.minimized;
    },

    render: function() {
      return(
        <aside id="dialogs">
          {this.isViewingOperation() &&
            OperationBox({ operation: this.props.operation })
          }

          {this.renderComponent()}
        </aside>
      );
    },

    closeDialog: function() {
      Actions.backToPrimaryView();
    }
  });

  return DialogLayout;
});