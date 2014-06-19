define([
  'pixy',
  'pixy/mixins/routes',
  'mixins/routes/trackable',
  'mixins/routes/nav_highlighter'
], function(Pixy, RouteMixins, TrackableMixin, NavHighlighterMixin) {
  var Route = Pixy.Route.extend({
    mixins: [
      RouteMixins.SecondaryTransitions,
      RouteMixins.AccessPolicy,
      RouteMixins.WindowTitle,
      RouteMixins.Loading,
      RouteMixins.Renderer,
      RouteMixins.Props,
      TrackableMixin,
      NavHighlighterMixin
    ],

    events: {
      willTransition: RouteMixins.SecondaryTransitions.willTransition
    },

    mount: function(component, options) {
      return this.trigger('render', component, options);
    },

    unmount: function(component, options) {
      return this.trigger('remove', component, options);
    }
  });

  return Route;
});