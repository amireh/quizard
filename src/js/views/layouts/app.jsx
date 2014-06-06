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
        navbar: {
          item:  '',
          child: ''
        }
      };
    },

    componentDidMount: function() {
      $(document.body).addClass('member');
    },

    componentWillUnmount: function() {
      $(document.body).removeClass('member');
    },

    render: function() {
      return (
        <div id="main">
          {this.props.loading && <LoadingBar />}

          <MenuBar
            accounts={this.props.accounts}
            activeAccountId={this.props.activeAccountId}
            authenticated={this.props.authenticated}
            email={this.props.user.email}
            name={this.props.user.name} />

          <Navigation
            active={this.props.navbar.item}
            activeChild={this.props.navbar.child} />

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