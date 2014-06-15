/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var DialogLayout = require('jsx!./dialog');
  var AppLayout = require('jsx!./app');
  var LoadingScreen = require('jsx!views/loading');
  var debugLog = require('util/debug_log');
  var ErrorDialog = require('jsx!views/error_dialog');
  var Actions = require('actions/routes');
  var log = debugLog('RootLayout');

  var RootLayout = React.createClass({
    mixins: [ React.addons.LayoutManagerMixin ],

    statics: {
      getLayout: function(name/*, props, state*/) {
        if (name === 'dialogs') {
          return DialogLayout;
        }
        else {
          return AppLayout;
        }
      }
    },

    getDefaultProps: function() {
      return {
        authenticated: false,
        transitioning: false
      };
    },

    componentWillReceiveProps: function(nextProps) {
      var prop;

      //>>excludeStart("production", pragmas.production);
      /* global DEBUG: false */
      log('new props:', DEBUG.diff(this.props, nextProps));
      //>>excludeEnd("production");

      // Remove "unset" props (ones that are undefined) completely
      for (prop in nextProps) {
        if (nextProps.hasOwnProperty(prop) && nextProps[prop] === undefined) {
          delete nextProps[prop];
        }
      }

      // Change the layout if authentication status has changed.
      if (this.props.authenticated !== nextProps.authenticated) {
        console.info('Authentication status has changed:',
          nextProps.authenticated);
      }

      if (nextProps.error) {
        this.add(ErrorDialog, 'dialogs');
      }
    },

    componentDidUpdate: function() {
      // If a store error is present, remove it after the first pass of #render
      // in which the error was set.
      //
      // This is so that the error won't stick around, and if any child wanted
      // to handle it, it would have done so in the last render pass.
      if (this.props.storeError) {
        this.setProps({
          storeError: null
        });
      }

      if (this.props.error) {
        // Notifier.error(this.props.error || 'Something went wrong.');

        this.setProps({
          error: null
        });
      }
    },

    render: function() {
      log('rendering...');

      return (
        <div>
          {
            !DialogLayout.isEmpty(this.props, this.state, true) &&
            this.renderLayout(DialogLayout, {
              key: 'dialogLayout',
              onClose: this.closeDialog
            })
          }

          {this.renderLayout(AppLayout, { key: 'appLayout' })}

          {this.props.transitioning && <LoadingScreen />}
        </div>
      );
    },

    closeDialog: function() {
      this.remove(this.getLayoutChildren(DialogLayout)[0], 'dialogs');
      Actions.backToPrimaryView();
    }
  });

  return RootLayout;
});