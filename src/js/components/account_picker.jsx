/** @jsx React.DOM */
define([
  'react',
  'ext/underscore',
  'actions/accounts',
  'jsx!components/dropdown'
],
function(React, _, AccountActions, Dropdown) {
  var DropdownToggle = Dropdown.Toggle;
  var DropdownMenu = Dropdown.Menu;
  var findBy = _.findBy;

  /**
   * @class Components.AccountPicker
   *
   * [brief component description]
   */
  var AccountPicker = React.createClass({
    mixins: [],
    propTypes: {
      accounts: React.PropTypes.arrayOf(React.PropTypes.shape({
        id: React.PropTypes.string,
        name: React.PropTypes.string,
        balance: React.PropTypes.number,
        currency: React.PropTypes.string
      }))
    },

    getDefaultProps: function() {
      return {
        accounts: [],
        activeAccountId: null
      };
    },

    render: function() {
      var activeAccount = findBy(this.props.accounts, {
        id: this.props.activeAccountId
      }) || { name: 'Choose an account' };

      return (
        <div className="account-picker">
          <Dropdown sticky={true}>
            <DropdownToggle className="btn btn-default btn-dropdown btn-block">
              <div className="heading sticky">
                <span className="add-on btn-dropdown-anchor icon-arrow-down" />
                <span className="active-account">{activeAccount.name}</span>
              </div>
            </DropdownToggle>

            <DropdownMenu tagName="ul" className="list-view sticky">
              {this.props.accounts.map(this.renderAccount)}
            </DropdownMenu>
          </Dropdown>
        </div>
      );
    },

    renderAccount: function(account) {
      return (
        <li
          onClick={this.activateAccount.bind(null, account.id)}
          key={account.id}
          className="list-item">
          <span className="btn-link">{account.name}</span>
        </li>
      );
    },

    activateAccount: function(id) {
      AccountActions.activate(id);
    }
  });

  return AccountPicker;
});