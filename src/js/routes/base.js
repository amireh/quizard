define([
  'ext/pixy',
  'pixy/mixins/routes',
  'mixins/routes/trackable'
], function(Pixy, RouteMixins, TrackableMixin) {
  var Route = Pixy.Route.extend({
    mixins: [
      RouteMixins.AccessPolicy,
      RouteMixins.WindowTitle,
      RouteMixins.Loading,
      RouteMixins.Renderer,
      RouteMixins.Props,
      TrackableMixin
    ],

    mount: function(component, options) {
      return this.trigger('render', component, options);
    },

    unmount: function(component, options) {
      return this.trigger('remove', component, options);
    },

    injectStoreError: function(actionIndex, storeError) {
      this.trigger('storeError', {
        actionIndex: actionIndex,
        error: storeError
      });
    },

    setStatus: function(message) {
      this.update({ status: message });
    },

    clearStatus: function() {
      this.setStatus(undefined);
    }
  });

  return Route;
});