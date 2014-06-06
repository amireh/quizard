define([], function() {

  /**
   * @class Routes.Mixins.Renderer
   *
   * Convenience mixin for mounting and unmounting components into layouts and
   * outlets automatically when a route is entered and exitted.
   *
   * === Usage example
   *
   * Here's an example of an Index page that utilizes three outlets: content,
   * the toolbar, and the sidebar.
   *
   *     new Pixy.Route('transactionIndex', {
   *       views: [
   *         { component: Listing },
   *         { component: Sidebar, outlet: 'sidebar' },
   *         { component: Toolbar, outlet: 'toolbar' }
   *       ]
   *     })
   *
   * Here's another example of rendering into a different layout, say "dialogs":
   *
   *     new Pixy.Route('login', {
   *       views: [{ component: Dialog, into: 'dialogs' }]
   *     })
   */
  return {
    /**
     * @property {Object[]} views
     *           Your view listing.
     *
     * @property {React.Class} views.component (required)
     *           A renderable React component.
     *
     * @property {String} [views.into="main"]
     *           Layout to mount the component in.
     *
     * @property {String} [views.outlet="content"]
     *           Layout outlet to mount the component in.
     */
    views: [],

    /**
     * @internal Mount defined components.
     */
    enter: function() {
      (this.views || []).forEach(function(spec) {
        this.mount(spec.component, {
          into: spec.into || 'main',
          outlet: spec.outlet || 'content'
        });
      }.bind(this));
    },

    /**
     * @internal Unmount components mounted in #enter().
     */
    exit: function() {
      (this.views || []).forEach(function(spec) {
        this.unmount(spec.component, {
          from: spec.into || 'main'
        });
      }.bind(this));
    }
  };
});