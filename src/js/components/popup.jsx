/** @jsx React.DOM */
define([
  'react',
  'ext/jquery',
  'ext/underscore',
  'util/keymapper'
], function(React, $, _, Keymapper) {
  var omit = _.omit;
  var merge = _.merge;

  /**
   * @class Components.Popup
   *
   * Wrap a React view inside a qTip popup, perfect for use in Editors.
   *
   * Example usage:
   *
   *     // Direct instantiation:
   *
   *     React.renderComponent(Popup({
   *       content: (<div>I'm a popup content!</div>)
   *     }), div);
   *
   *     // Inside a view's render method:
   *     <Popup content={MyPopupContent} />
   *
   *     // Pass a property to the content:
   *     <Popup content={MyPopupContent} name="Ahmad" />
   *
   *     // Customize qTip options:
   *     var options = {
   *       position: {
   *         // ...
   *       }
   *     };
   *     <Popup popupOptions={options} ... />
   */
  var Popup = React.createClass({
    propTypes: {
      /**
       * @cfg {React.Class} content (required)
       *
       * The Popup's content you want to render.
       */
      content: React.PropTypes.component.isRequired,

      /**
       * @cfg {React.Component} [children=<button>Show Popup</button>]
       *
       * Element to use as the popup's "toggle" button, which when clicked will
       * show the qTip.
       */
      children: React.PropTypes.component,

      /**
       * @cfg {Object} [popupOptions={}]
       *
       * qTip options.
       */
      popupOptions: React.PropTypes.object,

      /**
       * @cfg {String} [anchorSelector=".popup-anchor"]
       *
       * CSS selector to locate a child element to use as the popup's "anchor",
       * e.g, the positioning will be relative to that element instead of the
       * entirety of the popup's children.
       *
       * When unset, or the element could not be found, it defaults to using
       * the popup's children as anchor.
       */
      anchorSelector: React.PropTypes.string,

      /**
       * @cfg {Boolean} [withKeybindings=true]
       *
       * Whether the Popup should be keyboard-aware to close on Escape and
       * handle other custom keys.
       */
      withKeybindings: React.PropTypes.bool
    },

    keys: {
      'close':  [ 'escape', 'Close the popup', 'Popup' ]
    },

    getInitialState: function() {
      return {
        /**
         * @property {HTMLElement} container
         *
         * An auto-generated element that will contain the popup's content. The
         * container is classed with "popup-content" to achieve the necessary
         * Popup styling.
         *
         * This is the DOM node at which the content component will be mounted
         * at.
         */
        container: null,

        /**
         * @property {React.Component} content
         *
         * The rendered popup content component.
         */
        content: null
      };
    },

    getDefaultProps: function() {
      return {
        children: <button>Show Popup</button>,
        popupOptions: {},
        anchorSelector: '.popup-anchor',
        withKeybindings: true
      };
    },

    getContentProps: function(props) {
      return omit(props, [
        'content', 'popupOptions', 'anchorSelector', 'children',
        'withKeybindings'
      ]);
    },

    /**
     * @private
     *
     * Update the content with the new properties, and adjust the qTip's
     * position after the component re-renders.
     */
    componentDidUpdate: function() {
      if (this.state.content) {
        this.state.content.setProps(this.getContentProps(this.props));
      }

      if (this.qTip) {
        this.qTip.reposition();
      }
    },

    render: function() {
      return this.props.children;
    },

    componentDidMount: function() {
      var $this = $(this.getDOMNode());
      var $anchor = $this.find(this.props.anchorSelector);
      var $childContainer = $('<div class="popup-content" />');
      var options;

      if (!$anchor.length) {
        console.warn('No anchor found using', this.props.anchorSelector,
          '$(this) will be used as anchor.');
        $anchor = $this;
      }

      console.assert(this.props.content,
        "You must provide a 'content' component for a popup!");

      options = this.qtipOptions($this, $childContainer);
      this.qTip = $anchor.qtip(options).qtip('api');

      if (this.props.withKeybindings) {
        Keymapper(this, 'Popup');
      }

      this.setState({
        container: $childContainer[0],
        content: React.renderComponent(
          this.props.content(this.getContentProps(this.props)),
          $childContainer[0]
        )
      });
    },

    componentWillUnmount: function() {
      React.unmountComponentAtNode(this.state.container);

      if (this.qTip) {
        this.qTip.destroy(true);
      }
    },

    /**
     * Common qTip popup options.
     *
     * @param {jQuery[]} $buttons
     * Buttons that will show or hide the popup.
     *
     * @param {jQuery} $content
     * The content (or content element) of the popup.
     */
    qtipOptions: function($buttons, $content) {
      return merge({}, {
        overwrite: false,
        prerender: true,
        show: {
          event: 'click',
          delay: 0,
          target: $buttons,
          effect: false,
          solo: false
        },

        hide: {
          event: 'click',
          effect: false,
          fixed: true,
          target: $buttons
        },

        style: {
          classes: 'popup',
          def: false,
          tip: {
            corner: 'right center',
            width: 22,
            height: 11
          }
        },

        position: {
          effect: false,
          my: 'right center',
          at: 'left center',
          adjust: {
            x: 0,
            y: 0
          }
        },

        content: {
          text: $content
        },

        events: {
          show: function(event, api) {
            api.shown = true;

            if (this.props.withKeybindings) {
              this.bindKeys();
            }

            if (this.props.onShow) {
              this.props.onShow($content, api);
            }
          }.bind(this),

          hide: function(event, api) {
            api.shown = false;

            if (this.props.withKeybindings) {
              this.unbindKeys();
            }
          }.bind(this)
        }
      }, this.props.popupOptions);
    },

    close: function() {
      if (this.qTip.shown) {
        this.qTip.hide();
      }
    }
  });

  return Popup;
});