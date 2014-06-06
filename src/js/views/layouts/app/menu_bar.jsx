/** @jsx React.DOM */
define([
  'react',
  'jsx!./menu_bar/account_picker',
  'jsx!./menu_bar/settings',
], function(React, AccountPicker, Settings) {
  var StatusBar = React.createClass({
    getDefaultProps: function() {
      return {
        name: null,
        email: null,
        accounts: []
      };
    },

    render: function() {
      return(
        <header id="menubar">
          <AccountPicker
            accounts={this.props.accounts}
            activeAccountId={this.props.activeAccountId} />
          <div className="pull-right">
            {
              this.props.authenticated ?
                <Settings name={this.props.name} email={this.props.email} /> :
                <a className="menubar-btn" href="/login">Log in</a>
            }
          </div>
        </header>
      );
    }
  });

  return StatusBar;
});