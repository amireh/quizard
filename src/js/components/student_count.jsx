/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var K = require('constants');
  var StudentCount = React.createClass({
    render: function() {
      return(
        <div>
          <input
            className="form-input"
            type="number"
            min="1"
            max={K.USER_MAX_ENROLL}
            autoFocus={this.props.autoFocus}
            valueLink={this.props.valueLink} />

          <small className="add-on">
            Between {K.USER_MIN_ENROLL} and {K.USER_MAX_ENROLL}
          </small>
        </div>
      );
    }
  });

  return StudentCount;
});