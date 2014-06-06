/** @jsx React.DOM */
define([ 'react', 'underscore', 'util/debug_log' ], function(React, _, Logger) {
  var update = React.addons.update;
  var without = _.without;
  var contains = _.contains;

  var log = Logger('Layout');

  function assertValidRegion(regions, region) {
    if (regions.indexOf(region) === -1) {
      throw new Error(
        'Unknown layout region "' + region +
        '", valid regions are: ' + JSON.stringify(regions));
    }
  }

  function assertValidOutlet(outlets, outlet) {
    if (!contains(outlets, outlet)) {
      throw new Error("Unknown layout outlet '" + outlet +
        "', valid outlets are:" + JSON.stringify(outlets));
    }
  }

  var LayoutMixin = {
    getInitialState: function() {
      return {
        dialogs: [],
        outlets: {}
      };
    },

    /**
     * Add a new component to a specific region.
     *
     * @param {React.Class} component
     *        The component factory/type.
     *
     * @param {String} region
     *        The region to render the component in.
     *        Available regions are: "main", "dialogs".
     */
    add: function(component, region, outlet, callback) {
      var newState;

      assertValidRegion(this.availableRegions, region);

      switch(region) {
        case 'main':
          assertValidOutlet(this.availableOutlets(), outlet);

          //>>excludeStart("production", pragmas.production);
          if (this.state.outlets[outlet]) {
            console.assert(!this.state.outlets[outlet],
              "Outlet ", outlet, " is occupied by",
              this.state.outlets[outlet].type.displayName);
          }
          //>>excludeEnd("production");

          this.state.outlets[outlet] = component;

          newState = {
            outlets: this.state.outlets
          };
        break;
        case 'dialogs':
          newState = {
            dialogs: update(this.state.dialogs, {
              $unshift: [ component ]
            })
          };
        break;
      }

      log('adding component', component.type.displayName, 'to region', region + '#' + outlet);

      this.setState(newState, callback);
    },

    /**
     * Remove a previously rendered component in a specific region.
     *
     * @param  {React.Class} component
     *         The component you passed to #add and want to remove.
     *
     * @param  {String} region
     *         The region the component was mounted in.
     */
    remove: function(component, region) {
      var newState, outlet, outlets;

      assertValidRegion(this.availableRegions, region);

      log('removing component', component.type.displayName, 'from region', region);

      switch(region) {
        case 'main':
          outlets = this.state.outlets;

          for (outlet in outlets) {
            if (outlets[outlet] === component) {
              delete outlets[outlet];
              break;
            }
          }

          newState = { outlets: outlets };
        break;

        case 'dialogs':
          newState = { dialogs: without(this.state.dialogs, component) };
        break;
      }

      this.setState(newState);
    }
  };

  return LayoutMixin;
});