/** @jsx React.DOM */
define([
  'react',
  'jsx!components/dropdown',
  'actions/sessions'
], function(React, Dropdown, SessionActions) {
  var DropdownToggle = Dropdown.Toggle;
  var Settings = React.createClass({
    getDefaultProps: function() {
      return {
        name: 'Member',
        email: 'demo@pibiapp.com'
      };
    },

    render: function() {
      return(
        <div className="inline" id="mainMenu">
          <Dropdown>
            <DropdownToggle className="btn btn-default btn-dropdown padded menubar-btn">
              <span>{this.props.email}</span>
              <span className="add-on btn-dropdown-anchor icon-arrow-down"></span>
            </DropdownToggle>

            <ul className="dropdown-menu text-left pull-right" role="menu" id="main_menu">
              <li className="title">{this.props.name} </li>

              <li className="divider"></li>

              <li>
                <a
                  data-online="disable"
                  href="/logout"
                  onClick={this.logout}
                  className="dropdown-item icon-switch embedded-icon-16">
                  Logout
                </a>
              </li>
            </ul>
          </Dropdown>
        </div>
      );
    },

    logout: function(e) {
      e.preventDefault();

      SessionActions.destroy();
    }
  });

  return Settings;
});