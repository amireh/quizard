/** @jsx React.DOM */
define([ 'react' ], function(React) {
  var Statusbar = React.createClass({
    getDefaultProps: function() {
      return {
        message: undefined
      };
    },
    render: function() {
      return(
        <footer id="statusbar">
          {this.props.message}
        </footer>
      );
    }
  });

  return Statusbar;
});