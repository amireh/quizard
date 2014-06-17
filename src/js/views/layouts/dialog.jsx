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

    // componentDidMount: function() {
    //   $(document.body).addClass('with-dialog');
    // },

    // componentWillUnmount: function() {
    //   $(document.body).removeClass('with-dialog');
    // },

    componentDidUpdate: function(prevProps, prevState) {
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