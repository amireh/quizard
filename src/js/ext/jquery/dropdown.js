define([ 'jquery', 'underscore', 'jquery.jquerypp' ], function($, _) {
  'use strict';

  /**
   * @class jQuery.Dropdown
   */

  var manual_close_selector = '.close';
  var dropdowns = [];

  var Dropdown = function(element, options) {
    var $el = $(element);

    this.$el = $el;
    this.$parent = getParent($el);
    this.$menu = getMenu($el);
    this.$elements = this.$el.add(this.$parent.add(this.$menu));
    this.$delegates = this.$el;

    this.options = _.extend({}, Dropdown.prototype.options, options);

    if (this.options.sticky === 'auto') {
      this.options.sticky = $el.is('.sticky') || $el.attr('[data-dropdown-sticky]');
    }

    this.proxyHide = _.bind(this.hide, this);
    this.proxyShow = _.bind(this.show, this);

    // Show the dropdown when the target is clicked
    $el.on('click.dropdown', this.proxyShow);
  };

  Dropdown.prototype = {
    constructor: Dropdown,

    /**
     * @property {jQuery} $el
     * The trigger element.
     */
    $el: null,

    /**
     * @property {jQuery} $menu
     * The dropdown menu.
     */
    $menu: null,

    /**
     * @property {jQuery} [$elements=$()]
     *
     * Set of elements that will, when clicked, hide the dropdown.
     *
     * Defaults to the trigger element, its parent, and the dropdown menu.
     */
    $elements: $(),

    /**
     * @property {jQuery[]} [$delegates=$()]
     * Set of elements that will trigger dropdown events.
     */
    $delegates: $(),

    options: {
      /**
       * @cfg {Boolean} [toggle=true]
       * Toggle between showing and hiding the dropdown when the trigger element
       * is clicked, based on the dropdown's current state of visibility.
       */
      toggle: true,

      /**
       * @cfg {Boolean} [activate=true]
       * When the dropdown is visible, add an .active class to the trigger element
       * and any button inside the dropdown menu.
       */
      activate: true,

      /**
       * @cfg {Boolean/String} [sticky='auto']
       * Sticky dropdowns will not hide when a click lands inside of them.
       */
      sticky: 'auto',

      /**
       * @cfg {Boolean/String} [dropup='auto']
       * Turn the dropdown into a drop-up if there's not enough room to show it
       * below the trigger element. The resolution is done at show-time.
       *
       * On drop-up:
       *
       *  * the menu's parent element will be classed with .dropup
       *  * the dropdown menu element will be classed with .bottom-up
       */
      dropup: 'auto',

      /**
       * @cfg {String} [closeOn='']
       *
       * Optional selector for elements that should close the dropdown. This
       * can be used to hide the dropdown by clicking on elements *inside*
       * the menu.
       */
      closeOn: '',

      /**
       * @cfg {Boolean} [closeOnBackground=true]
       * Close the dropdown when a click lands outside of it.
       */
      closeOnBackground: true,

      duration: 150
    },

    show: function(e) {
      var that = this;
      var dropup = this.options.dropup;

      if (this.isVisible()) {
        // Clicking on the .dropdown-toggle element will toggle the menu if
        // the `toggle` option is set.
        if (this.options.toggle) {
          return this.hide();
        }

        // Nothing to do, we're already visible.
        return true;
      }

      // Hide other dropdowns.
      clearMenus();

      // Drop down or up?
      if (this.options.dropup === 'auto') {
        dropup = this.$menu.height() + this.$parent.offset().top > $(window).height();
      }

      if (dropup) {
        this.$parent.toggleClass('dropup', dropup);
        this.$menu.toggleClass('bottom-up', dropup);
      }

      this.$elements.addClass('open');
      this.$menu
        .show()
        .trigger('bind:ESCAPE', this.proxyHide);

      // Listen to clicks everywhere so we can hide ourselves if one lands outside
      // the menu.
      if (this.options.closeOnBackground) {
        $(document.body).on('click.dropdown', this.proxyHide);
      }

      if (this.options.closeOn.length) {
        this.$menu.on('click.dropdown', this.options.closeOn, this.proxyHide);
      }

      // Focus the trigger element, so the user can hide the menu by RETURN.
      this.$el.focus();
      this.$delegates.trigger('show.dropdown');

      if (this.options.activate) {
        this.$el.add(this.$el.find('.btn')).addClass('active');
      }

      // Track us, so clearMenus() knows that it should hide us.
      _.defer(function() {
        dropdowns.push(that);
      });

      return $.consume(e);
    },

    hide: function(e) {
      var that = this;

      // Don't hide if the click landed on a submenu item
      if (e) {
        if ($(e.target).parent().is(".dropdown-submenu")) {
          return true;
        }

        // Don't hide if the click landed inside the menu
        if (this.options.sticky) {
          var mask = this.$parent.compare($(e.target));

          if (mask & 16 /* contains */ || mask & 0 /* are identical */) {
            return true;
          }
        }
      }

      this.$menu
        .hide().promise()
        .then(_.bind(function() {
          this.$elements.removeClass('open');
          this.$menu.trigger('unbind:ESCAPE', this.proxyHide).hide();
          this.$delegates.trigger('hide.dropdown');

          if (this.options.closeOnBackground) {
            $(document.body).off('click.dropdown', this.proxyHide);
          }

          if (this.options.closeOn.length) {
            this.$menu.off('click.dropdown', this.options.closeOn, this.proxyHide);
          }

          if (this.options.activate) {
            this.$el.add(this.$el.find('.btn')).removeClass('active');
          }
          // stop tracking this dropdown
          _.defer(function() {
            var index = dropdowns.indexOf(this);

            if (index > -1) {
              dropdowns.splice( index, 1 );
            }
          }, this);
        }, this));

      return true; // don't intercept the click
    },

    toggle: function (e) {
      if (this.$el.is('.disabled, :disabled'))
        return false;

      this.isVisible() ? this.hide(e) : this.show(e);

      return false
    },

    isVisible: function() {
      return this.$parent.hasClass('open');
    }

  }

  function clearMenus() {
    _.invoke(dropdowns, 'hide');
  }

  function getMenu($this) {
    return $this.nextAll('.dropdown-menu:first');
  }

  function getParent($this) {
    return $this.parent();
  }


  /* DROPDOWN PLUGIN DEFINITION
   * ========================== */

  var old = $.fn.dropdown

  /**
   * @class jQuery.fn
   */

  /**
   * Create a dropdown instance for a trigger element.
   *
   * @param  {Object/String} [options={}]
   *
   *  - When Object: set of Dropdown#options to pass to the dropdown when initializing.
   *  - When String: name of an API method to invoke. A dropdown instance is implicitly
   *    created in this case if it was not initialized before.
   *
   * @method dropdown
   */
  $.fn.dropdown = function(options) {
    return this.each(function () {
      var $this = $(this);
      var dropdown = $this.data('dropdown');

      if (!dropdown) {
        dropdown = new Dropdown(this, _.isObject(options) ? options : {});
        $this.data('dropdown', dropdown);
      }

      // API call:
      if (_.isString(options)) {
        dropdown[options].call($this);
      }
    });
  };

  $.fn.dropdown.Constructor = Dropdown;

  $.fn.dropdown.noConflict = function() {
    $.fn.dropdown = old;

    return this;
  }
});
