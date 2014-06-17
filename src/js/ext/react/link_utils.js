/** @jsx React.DOM */
define([], function() {
  var LinkUtils;

  function NOOP() {}

  LinkUtils = {
    getValue: function(props) {
      if (!props) {
        return void 0;
      }
      else if (props.valueLink) {
        return props.valueLink.value;
      }
      else {
        return props.value;
      }
    },

    getChangeHandler: function(props) {
      var requestChange;

      if (props && props.valueLink) {
        requestChange = props.valueLink.requestChange;

        return function(e) {
          return requestChange(e.target && e.target.value ? e.target.value : e);
        };
      }
      else if (props && props.onChange) {
        return props.onChange;
      }
      else {
        return NOOP;
      }
    },

    onChange: function(props, value) {
      return LinkUtils.getChangeHandler(props)(value);
    }
  };

  return LinkUtils;
});