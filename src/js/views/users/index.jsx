/** @jsx React.DOM */
define([ 'react' ], function(React) {
  var UserIndex = React.createClass({
    getDefaultProps: function() {
      return {
        accounts: []
      };
    },

    render: function() {
      return(
        <div>
          <p>Choose a recipe to the left.</p>
        </div>
      );
    },

    renderAccount: function(account) {
      return (
        <li key={account.id}>{account.name}</li>
      )
    }
  });

  return UserIndex;
});