/** @jsx React.DOM */
define([
  'react',
  'actions/accounts',
  'jsx!components/chosen'
],
function(React, AccountActions, Chosen) {
  var chosenOptions = { width: '100%' };
  var NO_ACCOUNT_ID = 'none';
  var NO_ACCOUNT = [{
    id: NO_ACCOUNT_ID,
    name: 'Choose an account'
  }];

  /**
   * @class Components.AccountPicker
   *
   * A combo box that allows the user to activate a specific account.
   */
  var AccountPicker = React.createClass({
    propTypes: {
      accounts: React.PropTypes.arrayOf(React.PropTypes.shape({
        id: React.PropTypes.string,
        name: React.PropTypes.string
      }))
    },

    getDefaultProps: function() {
      return {
        accounts: [],
        activeAccountId: NO_ACCOUNT_ID
      };
    },

    render: function() {
      var accounts = this.props.activeAccountId === NO_ACCOUNT_ID ?
        NO_ACCOUNT.concat(this.props.accounts) :
        this.props.accounts;

      return (
        <Chosen
          synchronize
          className="with-arrow"
          chosenOptions={chosenOptions}
          value={this.props.activeAccountId}
          onChange={this.activateAccount}
          children={accounts.map(this.renderAccount)} />
      );
    },

    renderAccount: function(account) {
      return (
        <option key={account.id} value={account.id} children={account.name} />
      );
    },

    activateAccount: function(e) {
      if (e.target.value === NO_ACCOUNT_ID) {
        return;
      }

      AccountActions.activate(e.target.value);
    }
  });

  return AccountPicker;
});