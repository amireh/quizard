define([ 'underscore' ], function(_) {
  var uniq = _.uniq;
  var keys = _.keys;

  function track(props) {
    this._propKeys = uniq(keys(props).concat(this._propKeys || []));
  }

  /**
   * @class Mixins.Routes.Props
   *
   * Utility for injecting props into the app layout.
   *
   * The mixin automatically takes care of cleaning up any props you inject
   * after the route exits.
   */
  return {
    update: function(props) {
      this.trigger('update', props);

      // Track the injected props so we can clean them up on exit.
      track.call(this, props);
    },

    exit: function() {
      if (!this._propKeys) {
        return;
      }

      var props = this._propKeys.reduce(function(props, key) {
        props[key] = undefined;
        return props;
      }, {});

      this.update(props);
    }
  };
});