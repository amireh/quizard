/** @jsx React.DOM */
define([ 'react' ], function(React) {
  /**
   * @class Components.Dialog
   *
   * Dialog.
   */
  var Dialog = React.createClass({
    propTypes: {
      onClose: React.PropTypes.func.isRequired
    },

    getDefaultProps: function() {
      return {
        /**
         * @property [Number] [priority=100]
         * The priority defines which dialog should be in the front at any one time.
         *
         * The lower the priority number, the higher the chance the dialog will be
         * in the front.
         */
        priority: 100,

        /**
         * @property [Boolean] [blocking=true]
         *
         * An exclusive dialog will hide any other dialogs when brought to front.
         */
        exclusive: true,

        /**
         * @cfg {String} [title="Dialog"]
         *
         * This string will be displayed in the dialog's header, you can either
         * provide a direct translation here, or define a .dialog-header element
         * in your dialog markup that will be used instead.
         */
        title: 'Dialog',

        /**
         * @cfg {Boolean} [closable=true]
         *
         * If you're using the stock dialog header, turning this on will add
         * a close button.
         *
         * If you're not and still want the closing functionality (which you
         * should), just define a button with a [data-action="close"] in your
         * markup and it will work.
         */
        closable: true,

        /**
         * @cfg {Boolean} [centered=false]
         *
         * Will center the dialog based on its width and height in JS. And not
         * very reliably so.
         *
         * @warn This is kind-of really buggy.
         */
        centered: false,

        /**
         * @cfg {Boolean} [scrollable=true]
         *
         * If you know/expect your dialog content to need scrolling on certain
         * screens, make sure to turn this on so that the users get to see all of
         * it.
         *
         * Makes the dialog's height fixed.
         */
        scrollable: true,

        /**
         * @cfg {Boolean} [stickyActions=false]
         *
         * Set to true if you want the .dialog-actions to be pulled to the bottom
         * and become "fixed".
         */
        stickyActions: false,

        thin: false,

        noPadding: false,

        /**
         * @cfg {String} [autoFocus=null]
         *
         * Selector to a DOM node to auto-focus when the dialog is brought to
         * front.
         *
         * Defaults to the dialog's element if not present.
         */
        autoFocus: null,

        className: ''
      };
    },

    componentDidMount: function() {
      var focusNode = this.getDOMNode();
      var focusNodeSelector = this.props.autoFocus;

      if (focusNodeSelector) {
        focusNode = focusNode.querySelector(focusNodeSelector) || focusNode;
      }

      setTimeout(focusNode.focus.bind(focusNode), 50);
    },

    render: function() {
      var klasses = React.addons.classSet({
        'dialog': true,
        'thin-dialog': this.props.thin,
        'align-center': this.props.centered,
        'no-padding': this.props.noPadding
      });

      return (
        <div
          className={[ klasses, this.props.className ].join(' ')}
          style={this.props.style}>
          {this.renderHeader()}

          <section className="dialog-main">
            <div className="dialog-content">
              {this.props.children.call ?
                this.transferPropsTo(this.props.children()) :
                this.props.children
              }
            </div>
          </section>

          {this.renderFooter()}
        </div>
      );
    },

    renderHeader: function() {
      var title = this.props.title;
      var icon = this.props.icon;
      var closable = this.props.closable;

      if (!title) {
        return false;
      }

      return (
        <header className="dialog-title">
          {icon && <i className={icon} />}

          {title}

          {closable &&
          <button
            onClick={this.close}
            className="icon-close close-dialog-button" />
          }
        </header>
      );
    },

    renderFooter: function() {
      // TODO
      var footer = this.props.footer;

      if (!footer) {
        return false;
      }

      return (
        <footer className="dialog-actions">
          {footer}
        </footer>
      );
    },

    close: function() {
      this.props.onClose();
    }
  });

  return Dialog;
});