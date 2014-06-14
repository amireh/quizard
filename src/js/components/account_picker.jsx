/** @jsx React.DOM */
define([
  'react',
  'actions/accounts',
  'jsx!components/chosen'
],
function(React, AccountActions, Chosen) {
  var chosenOptions = {
    width: '100%'
  };

  /**
   * @class Components.AccountPicker
   *
   * [brief component description]
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
        activeAccountId: null
      };
    },

    render: function() {
      return (
        <Chosen
          synchronize
          className="with-arrow"
          chosenOptions={chosenOptions}
          value={this.props.activeAccountId}
          onChange={this.activateAccount}
          children={this.props.accounts.map(this.renderAccount)} />
      );
    },

    renderAccount: function(account) {
      return (
        <option key={account.id} value={account.id} children={account.name} />
      );
    },

    activateAccount: function(e) {
      AccountActions.activate(e.target.value);
    }
  });

  return AccountPicker;
});