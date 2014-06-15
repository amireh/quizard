/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var K = require('constants');
  var StudentCount = React.createClass({
    getDefaultProps: function() {
      return {
        onChange: undefined,
        value: undefined,
        valueLink: undefined,
        min: K.USER_MIN_ENROLL,
        max: K.USER_MAX_ENROLL
      };
    },

    render: function() {
      return(
        <div>
          <input
            className="form-input"
            type="number"
            min={this.props.min}
            max={this.props.max}
            autoFocus={this.props.autoFocus}
            value={this.props.value}
            onChange={this.props.onChange}
            valueLink={this.props.valueLink} />

          <small className="add-on">
            Between {this.props.min} and {this.props.max}
          </small>
        </div>
      );
    }
  });

  return StudentCount;
});