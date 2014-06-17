define([], function() {
  return {
    getDefaultProps: function() {
      return {};
    },

    linkProp: function(propName) {
      var props = {};

      return {
        value: this.props[propName],
        requestChange: function(value) {
          props[propName] = value;
          this.saveProp(propName, value, props);
        }.bind(this)
      };
    }
  };
});