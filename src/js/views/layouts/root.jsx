/** @jsx React.DOM */
define([
  'react',
  'jsx!./dialog',
  'jsx!./guest',
  'jsx!./app',
  'jsx!views/loading',
  'modules/notifier',
  'util/debug_log'
], function(React,
  DialogLayout,
  GuestLayout,
  AppLayout,
  LoadingScreen,
  Notifier,
  debugLog) {

  var log = debugLog('RootLayout');

  var getChildLayout = function(props) {
    return props.authenticated ? AppLayout : GuestLayout;
  };

  var setChildLayout = function(props) {
    var childLayout = getChildLayout(props || this.props);

    this.setState({
      childLayout: childLayout
    });
  };

  var RootLayout = React.createClass({
    mixins: [ React.addons.LayoutManagerMixin ],

    statics: {
      getLayout: function(name, props, state) {
        if (name === 'dialogs') {
          return DialogLayout;
        }
        else if (name === 'guest') {
          return GuestLayout;
        }
        else if (name === 'member') {
          return AppLayout;
        }
        else {
          return getChildLayout(props);
        }
      }
    },

    getInitialState: function() {
      return {
        childLayout: getChildLayout(this.props)
      };
    },

    getDefaultProps: function() {
      return {
        authenticated: false,
        transitioning: false
      };
    },

    componentWillReceiveProps: function(nextProps) {
      var prop, childLayout;

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

        childLayout = getChildLayout(this.props);

        if (childLayout) {
          this.clearLayout(getChildLayout(this.props));
        }

        setChildLayout.call(this, nextProps);
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
        Notifier.error(this.props.error || 'Something went wrong.');

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
            !DialogLayout.isEmpty(undefined, this.state) &&
            this.renderLayout(DialogLayout, { key: 'dialogLayout' })
          }

          <div id="main">
            {this.renderLayout(this.state.childLayout, { key: 'childLayout' })}
          </div>

          {this.props.transitioning && <LoadingScreen />}
        </div>
      );
    }
  });

  return RootLayout;
});