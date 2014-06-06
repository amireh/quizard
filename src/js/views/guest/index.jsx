/** @jsx React.DOM */
define([ 'react', 'jsx!./login' ], function(React, Login) {
  var Index = React.createClass({
    render: function() {
      return(
        <div id="content">
          <Login />
        </div>
      );
    }
  });

  return Login;
});