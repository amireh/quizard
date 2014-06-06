define([ 'ext/underscore', 'chosen' ], function(_) {
  var defaults = {
    inherit_select_classes: true,
    disable_search: true,
    width: '100%'
  };

  return {
    create: function($selector, options) {
      options = _.extend({}, defaults, options);

      $selector.chosen(options);

      if (options.minWidth) {
        $selector.data('chosen').container.css({
          minWidth: options.minWidth
        });
      }
    },

    destroy: function($selector) {
      $selector.chosen('destroy');
    },

    update: function($selector) {
      $selector.trigger('chosen:updated');
    }
  };
});