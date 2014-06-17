/** @jsx React.DOM */
define([ 'react' ], function(React) {
  var Toolbar = React.createClass({
    getDefaultProps: function() {
      return {
        children: false
      };
    },

    render: function() {
      return(
        <footer id="toolbar">
          {this.props.children}
        </footer>
      );
    }
  });

  return Toolbar;
});