define([ 'underscore', 'shortcut', 'util/sanitize' ], function(_, Shortcut, Sanitize) {
  var keybindings = {};
  var GLOBAL_CONTEXT = [ 'anywhere', 'global' ];
  var installBinding = function(entry, object) {
    var keybinding  = entry[0],
        callback_id = entry[1],
        callback    = object[callback_id];

    if (object.keyAnalytics && object.state) {
      var action = entry[3];

      object.log('Keybinding analytics will be submitted for action ', action);

      callback = function() {
        object.state.trigger('analytics:action', 'Keybinding', action);
        return object[callback_id].apply(object, arguments);
      };
    }

    Shortcut.add(keybinding, callback, { context: object });
  };

  var removeBinding = function(entry, object) {
    var keybinding = entry[0],
        callback   = entry[1];

    Shortcut.remove(keybinding, object[callback], { context: object });
  };

  var isGlobal = function(context) {
    return context && _.indexOf(GLOBAL_CONTEXT, context.toLowerCase()) > -1;
  };

  /**
   * @class Util.Keymapper
   * @inheritable
   *
   * Keyboard connector module. Can be mixed-in by any module to conveniently
   * bind keys to actions.
   */
  var Keymapper = {
    allKeybindings: function() {
      return keybindings;
    },

    buildKeymap: function(store_key, keymap) {
      if (this.keybindings) {
        delete this.keymap;
        delete this.keyactions;
      }

      keymap = keymap || this.keys || {};

      this.keybindings = {};
      this.keyactions  = [];
      this.keymap      = keymap;

      if (typeof(keymap) == 'function') {
        keymap = keymap();
      }

      _.each( _.pairs( this.keymap ), function(entry) {
        if (_.isFunction(entry[1])) {
          entry[1] = entry[1].apply(this, []);
        }

        var action        = entry[0],
            default_key   = $.isArray(entry[1]) ? entry[1][0] : entry[1],
            description   = $.isArray(entry[1]) ? entry[1][1] : '',
            context       = $.isArray(entry[1]) && entry[1][2] ? entry[1][2] : '',
            global        = isGlobal(context),
            key           = this.keybindings[action] || default_key,
            callback      = action;

        if (description.match(/ns_[\w|_]+\./)) {
          description = i18n.t(description);
        }

        if (!this[callback]) {
          throw 'no such callback for keybinding action \'' + action + '\' on key \'' + key + '\'';
        }

        this.keyactions.push([
          this.keybindings[action] || default_key,
          callback,
          global,
          action
        ]);

        keybindings[ [key, Sanitize(store_key)].join(':') ] = {
          key:          key,
          description:  description,
          context:      context
        };

        if (global) {
          installBinding(_.last(this.keyactions), this);
        }

      }, this);

      return this.keyactions;
    },

    bindKeys: function() {
      this.unbindKeys();

      _.each(this.keyactions, function(entry) {
        var global = entry[2];

        if (!global) {
          // global keybindings were already installed
          installBinding(entry, this);
        }

        // console.debug('binding ' + entry[0]);

        return true;
      }, this);

      return this;
    },

    unbindKeys: function() {
      _.each(this.keyactions || [], function(entry) {
        var global = entry[2];

        if (!global) {
          removeBinding(entry, this);
        }

        // console.debug('unbinding ' + entry[0]);

        return true;
      }, this);

      return this;
    },
  };

  return function(object, store_key) {
    if (!store_key) {
      throw 'no store key!';
    }

    _.extend(object, Keymapper);

    object.buildKeymap(store_key);

    return object;
  };
});