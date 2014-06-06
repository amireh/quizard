define([
  'ext/pixy',
  'util/get',
  'mixins/routes/access_policy',
  'mixins/routes/window_title',
  'mixins/routes/loading',
  'mixins/routes/secondary_transitions',
  'mixins/routes/renderer',
  'mixins/routes/trackable',
  'mixins/routes/props',
],
function(
  Pixy,
  get,
  AccessPolicyMixin,
  WindowTitleMixin,
  LoadingMixin,
  SecondaryTransitionsMixin,
  RendererMixin,
  TrackableMixin,
  PropsMixin)
{
  var Route = Pixy.Route.extend({
    mixins: [
      AccessPolicyMixin,
      SecondaryTransitionsMixin,
      WindowTitleMixin,
      LoadingMixin,
      RendererMixin,
      TrackableMixin,
      PropsMixin
    ],

    get: get,

    events: {
      willTransition: function(transition) {
        SecondaryTransitionsMixin.events.willTransition.call(this, transition);
      }
    },

    mount: function(component, options) {
      return this.trigger('render', component, options);
    },

    unmount: function(component, options) {
      return this.trigger('remove', component, options);
    },

    update: PropsMixin.update,

    injectStoreError: function(actionIndex, storeError) {
      this.trigger('storeError', {
        actionIndex: actionIndex,
        error: storeError
      });
    },

    setStatus: function(message, ratio) {
      setTimeout(function() {
        this.update({ status: message });
      }.bind(this), 100);
    },

    clearStatus: function() {
      this.setStatus(undefined);
    },

    /** @internal  */
    _propKeys: []
  });

  return Route;
});