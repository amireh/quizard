/** @jsx React.DOM */
define([
  'ext/react',
  'jquery',
  'jsx!./app/navigation',
  'jsx!./app/menu_bar',
  'jsx!./app/statusbar',
  'jsx!./app/loading_bar',
], function(React, $, Navigation, MenuBar, Statusbar, LoadingBar) {

  var AppLayout = React.createClass({
    mixins: [ React.addons.LayoutMixin ],
    statics: {
      defaultOutlet: 'content',

      availableOutlets: function() {
        return [ 'content' ];
      }
    },

    getDefaultProps: function() {
      return {
        user: {},
        navLink: ''
      };
    },

    render: function() {
      return (
        <div id="main">
          {this.props.loading && <LoadingBar />}

          <Navigation
            authenticated={this.props.authenticated}
            operation={this.props.operation}
            email={this.props.user.email}
            active={this.props.navLink} />

          <main id="content">
            {this.renderOutlet('content')}
          </main>

          <Statusbar message={this.props.status} />
        </div>
      );
    }
  });

  return AppLayout;
});