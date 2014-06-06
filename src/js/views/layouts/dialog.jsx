/** @jsx React.DOM */
define([
  'react',
  'jquery',
  'actions/routes'
], function(React, $, Actions) {
  var DialogLayout = React.createClass({
    getDefaultProps: function() {
      return {
        children: false,
        onClose: this.closeDialog
      };
    },

    componentDidMount: function() {
      $(document.body).addClass('with-dialog');
    },

    componentWillUnmount: function() {
      $(document.body).removeClass('with-dialog');
    },

    render: function() {
      return(
        <aside id="dialogs">
          {this.transferPropsTo(this.props.children())}
        </aside>
      );
    },

    closeDialog: function() {
      Actions.backToPrimaryView();
    }
  });

  return DialogLayout;
});