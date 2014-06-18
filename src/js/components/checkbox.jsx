/** @jsx React.DOM */
define(function(require) {
  var React = require('react');

  /**
   * @class Components.Checkbox
   *
   * A nice-looking custom checkbox. This component takes care of wrapping
   * the checkbox with a label, so just pass in a "label" prop and other props
   * to the <input /> field itself you may need.
   */
  var Checkbox = React.createClass({
    propTypes: {
      label: React.PropTypes.string.isRequired
    },

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