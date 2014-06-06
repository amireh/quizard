/** @jsx React.DOM */
define([ 'react', 'underscore' ], function(React, _) {
  var omit = _.omit;
  var isEqual = _.isEqual;
  var isArray = Array.isArray;
  var isDirty = function(newVal, oldVal, _arrayTest) {
    if (_arrayTest) {
      return !isEqual(oldVal.sort(), newVal.sort());
    }

    return !isEqual(oldVal, newVal);
  };

  return {
    getInitialState: function() {
      return {};
    },

    linkState: function(key, defaultValue) {
      var partialState = {};
      var initialValue = defaultValue || String(this.props[key] || '');
      var arrayLink = isArray(initialValue);

      return {
        value: this.state[key],
        defaultValue: initialValue,
        requestChange: function(value) {
          this._dirtyLink = true;

          partialState[key] = value;

          if (isDirty(value, initialValue, arrayLink)) {
            this.setState(partialState);
            // console.debug(key, 'has been modified to', value, 'from', initialValue);
          } else {
            this.replaceState(omit(this.state, key));
            // console.debug(key, 'has been restored');
          }
        }.bind(this)
      };
    },

    componentDidUpdate: function() {
      if (this._dirtyLink) {
        this._dirtyLink = false;
        if (this.props.onChange) {
          this.props.onChange(this.state);
        }
      }
    }
  };
});