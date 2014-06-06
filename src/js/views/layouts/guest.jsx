/** @jsx React.DOM */
define([
  'react',
  'jquery',
  'underscore'
], function(React, $, _) {
  var isEmpty = _.isEmpty;
  var GuestLayout = React.createClass({
    mixins: [ React.addons.LayoutMixin ],
    statics: {
      defaultOutlet: 'content',

      availableOutlets: function() {
        return [ 'content' ];
      }
    },

    componentDidMount: function() {
      $(document.body).addClass('guest');
    },

    componentWillUnmount: function() {
      $(document.body).removeClass('guest');
    },

    render: function() {
      if (this.type.isEmpty(this.props)) {
        return <div />;
      }

      return(
        <main id="main">{this.renderOutlet('content')}</main>
      );
    }
  });

  return GuestLayout;
});