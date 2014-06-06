/** @jsx React.DOM */
define([ 'react' ], function(React) {
  var Emblem = React.createClass({
    propTypes: {
      emblem: React.PropTypes.string,
      fontSize: React.PropTypes.number,
      skipStyling: React.PropTypes.bool,
      accessible: React.PropTypes.bool
    },

    getDefaultProps: function() {
      return {
        fontSize: 16,
        skipStyling: false,
        accessible: false
      };
    },

    render: function() {
      var emblemKlass, klasses, style, props, component;

      emblemKlass = this.props.emblem || 'emblem-default';

      if (emblemKlass[0] === '@') {
        emblemKlass = 'icon-' + emblemKlass.substr(1);
      }
      else if (!emblemKlass.match(/^emblem\-/)) {
        emblemKlass = 'emblem-' + emblemKlass;
      }

      klasses = {};
      klasses[emblemKlass] = true;

      if (this.props.className) {
        klasses[this.props.className] = true;
      }

      if (this.props.accessible) {
        klasses['a11y-btn'] = true;
      }

      if (!this.props.skipStyling) {
        style = {
          'fontSize': this.props.fontSize,
          'width': this.props.width || (this.props.fontSize * 1.5),
          'vertical-align': 'middle',
          'display': 'inline-block'
        };
      }

      props = {
        className: React.addons.classSet(klasses),
        style: style
      };

      if (this.props.accessible) {
        component = React.DOM.button;
      } else {
        component = React.DOM.i;
      }

      return component(props);
    }
  });

  return Emblem;
});