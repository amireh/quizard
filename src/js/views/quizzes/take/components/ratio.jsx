/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var Ratio = React.createClass({
    propTypes: {
      onChange: React.PropTypes.func.isRequired
    },

    getDefaultProps: function() {
      return {
        readOnly: false,
        value: 0
      };
    },

    render: function() {
      return(
        <label className="form-label input-append">
          <input
            className="form-input"
            type="number"
            min="0"
            max="100"
            readOnly={this.props.readOnly}
            value={this.props.value}
            onChange={this.props.onChange} />
          <span className="add-on">%</span>
        </label>
      );
    },

  });

  return Ratio;
});