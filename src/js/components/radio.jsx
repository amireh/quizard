/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var Radio = React.createClass({
    getDefaultProps: function() {
      return {
        spanner: false
      };
    },

    render: function() {
      var className = React.addons.classSet({
        'skinned-radio': true,
        'input-spanner': !!this.props.spanner
      });

      return(
        <label className={className}>
          {this.transferPropsTo(<input type="radio" />)}
          <span>{this.props.label || this.props.children}</span>
        </label>
      );
    }
  });

  return Radio;
});