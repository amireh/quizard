/** @jsx React.DOM */
define(function(require) {
  var $ = require('jquery');
  var React = require('ext/react');
  var Actions = require('actions/routes');
  var AppActions = require('actions/app');

  var DialogLayout = React.createClass({
    mixins: [ React.addons.StackedLayoutMixin ],

    getDefaultProps: function() {
      return {
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