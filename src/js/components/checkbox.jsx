/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var Checkbox = React.createClass({
    render: function() {
      return(
        <label className="skinned-checkbox">
          {this.transferPropsTo(<input type="checkbox" />)}
          <span>{this.props.label}</span>
        </label>
      );
    }
  });

  return Checkbox;
});