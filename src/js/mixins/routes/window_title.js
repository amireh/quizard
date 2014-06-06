define([], function() {
  var previousTitle;

  /**
   * @class Routes.Mixins.WindowTitle
   *
   * Set a custom document title while a route is active.
   *
   * === Example usage
   *
   *    define('i18n!transactions/index', function(t) {
   *      new Pixy.Route('transactionsIndex', function() {
   *        windowTitle: function() {
   *          return t('windowTitle', 'Home - My Fancy App');
   *        }
   *      });
   *    });
   */
  return {
    /**
     * @property {String|#call} windowTitle (required)
     *
     * A string, or a function that returns a string to use as the document
     * title.
     *
     * You should probably i18nize the title in a function.
     */
    windowTitle: undefined,

    enter: function() {
      var title = this.get('windowTitle');

      if (title) {
        previousTitle = document.title;
        document.title = title;
      }
    },

    exit: function() {
      if (previousTitle) {
        document.title = previousTitle;
        previousTitle = null;
      }
    }
  };
});