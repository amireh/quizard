/** @jsx React.DOM */
define([
  'react',
  'mixins/layout',
  'jsx!./dialog',
  'jsx!./app/navigation',
  'jsx!./app/menu_bar',
  'jsx!./app/statusbar',
  'jsx!../loading_screen',
  'jsx!views/loading_bar',
  'modules/notifier',
  'util/debug_log'
], function(React,
  LayoutMixin,
  DialogLayout,
  Navigation,
  MenuBar,
  Statusbar,
  LoadingScreen,
  LoadingBar,
  Notifier,
  debugLog) {

  var log = debugLog('AppLayout');

  var AppLayout = React.createClass({
    mixins: [ LayoutMixin ],

    availableRegions: [ 'main', 'dialogs' ],
    availableOutlets: [ 'content' ],

    getDefaultProps: function() {
      return {
        authenticated: false,
        transitioning: false,
        user: {},
        navbar: {
          item:  undefined,
          child: undefined
        },
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
      var dialog = this.state.dialogs[0];
      var outlets = this.state.outlets;

      log('rendering...');

      return (
        <div>
          {dialog && this.transferPropsTo(<DialogLayout children={dialog} />)}

          <div id="main">
            <MenuBar
              accounts={this.props.accounts}
              activeAccountId={this.props.activeAccountId}
              authenticated={this.props.authenticated}
              email={this.props.user.email}
              name={this.props.user.name} />

            {this.props.loading && <LoadingBar />}

            <Navigation
              active={this.props.navbar.item}
              activeChild={this.props.navbar.child} />

            <div id="content" className="content">
              {outlets.content && this.transferPropsTo(outlets.content())}
            </div>

            <Statusbar message={this.props.status} />
          </div>

          {this.props.transitioning && <LoadingScreen />}
        </div>
      );
    }
  });

  return AppLayout;
});