/** @jsx React.DOM */
define([
  'react',
  'jsx!./menu_bar/settings',
], function(React, Settings) {
  var StatusBar = React.createClass({
    getDefaultProps: function() {
      return {
        name: null,
        email: null,
        accounts: [],
        courses: [],
      };
    },

    render: function() {
      return(
        <header id="menubar">
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