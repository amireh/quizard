/** @jsx React.DOM */
define([ 'react', 'jquery' ], function(React, $) {
  var Loading = React.createClass({
    getDefaultProps: function() {
      return {
        version: '1.0.0',
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
      // $(document.body).toggleClass('state-loading', visible);
      $this.css({
        opacity: visible ? '1' : '0'
      });

      setTimeout(function() {
        $this.toggleClass('background', !visible);
      }, 250);
    },


    render: function() {
      return(
        <div id="loading_screen" className="loading">
          <header>
            <span className="version">
              Quizard
              {' '}
              {this.props.version}
            </span>

            <span id="loading_status"></span>
          </header>

          <div className="logo text-center crazy-flip icon-128" />
        </div>
      );
    }
  });

  return Loading;
});