define(function(require) {
  var $ = require('ext/jquery');
  var _ = require('underscore');
  var merge = _.merge;
  var defaults = {
    position: {
      my: 'bottom center',
      at: 'top center'
    },
    show: {
      delay: false
    }
  };

  var TooltipsMixin = {
    componentDidMount: function() {
      var options = merge({}, defaults, this.tooltipOptions);

      $(this.getDOMNode()).find('[title]').qtip(options);
    },

    componentWillUnmount: function() {
      $(this.getDOMNode()).find('[title]').qtip('destroy', true);
    }
  };

  return TooltipsMixin;
});