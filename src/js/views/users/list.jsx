/** @jsx React.DOM */
define([ 'react', 'actions/users' ], function(React, UserActions) {
  var UserIndex = React.createClass({
    getDefaultProps: function() {
      return {
        users: []
      };
    },

    render: function() {
      return(
        <div>
          {this.props.activeAccountId ?
            this.renderUserListing() :
            this.renderRequirementWarning()
          }
        </div>
      );
    },

    renderUserListing: function() {
      return (
        <div>
          {this.props.users.map(this.renderUser)}
          <footer className="actions">
            <button className="btn btn-default" onClick={this.loadUsers}>
              Load users
            </button>
          </footer>
        </div>
      );
    },

    renderUser: function(user) {
      return (
        <li key={user.id}>{user.name}</li>
      );
    },

    renderRequirementWarning: function() {
      return (
        <p className="alert">You must activate an account first.</p>
      );
    },

    loadUsers: function() {
      UserActions.loadAll();
    }
  });

  return UserIndex;
});