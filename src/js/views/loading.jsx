/** @jsx React.DOM */
define([ 'react', 'jquery', 'version' ], function(React, $, version) {
  var Loading = React.createClass({
    getDefaultProps: function() {
      return {
        version: version,
        visible: true
      };
    },

    componentDidMount: function() {
      // Must defer in order to trigger the CSS transition
      setTimeout(this.toggle.bind(this, this.props.visible), 1);
    },

    componentWillUnmount: function() {
      this.toggle(false);
    },

    componentWillReceiveProps: function(nextProps) {
      if (nextProps.visible !== this.props.visible) {
        this.toggle(nextProps.visible);
      }
    },

    toggle: function(visible) {
      var $this = $(this.getDOMNode());

      $this.css({
        opacity: visible ? '1' : '0'
      });

      $(document.body).toggleClass('state-loading', visible);

      setTimeout(function() {
        $this.toggleClass('background', !visible);
      }, 250);
    },


    render: function() {
      return(
        <div id="loading_screen">
          <header className="version pulsate">
            Quizard
            {' '}
            {this.props.version}
          </header>

          <div className="logo" />
        </div>
      );
    }
  });

  return Loading;
});