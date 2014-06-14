define([
  'ext/pixy',
  'pixy/mixins/routes',
  'mixins/routes/trackable',
  'mixins/routes/nav_highlighter'
], function(Pixy, RouteMixins, TrackableMixin, NavHighlighterMixin) {
  var Route = Pixy.Route.extend({
    mixins: [
      RouteMixins.AccessPolicy,
      RouteMixins.WindowTitle,
      RouteMixins.Loading,
      RouteMixins.Renderer,
      RouteMixins.Props,
      TrackableMixin,
      NavHighlighterMixin
    ],

    mount: function(component, options) {
      return this.trigger('render', component, options);
    },

    unmount: function(component, options) {
      return this.trigger('remove', component, options);
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