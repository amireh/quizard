/** @jsx React.DOM */
define([ 'react', 'jquery' ], function(React, $) {
  var LoadingScreen = React.createClass({
    getDefaultProps: function() {
      return {
        version: '1.0.0'
      };
    },

    componentDidMount: function() {
      $(document.body).addClass('state-loading');
    },

    componentWillUnmount: function() {
      $(document.body).removeClass('state-loading');
    },

    render: function() {
      return(
        <div id="loading_screen" className="loading">
          <header><span id="loading_status"></span></header>
          <div className="logo text-center crazy-flip icon-pibi-framed icon-128" />
          <small className="version">Quizard
            {' '}
            <span id="version">{this.props.version}</span>
          </small>
        </div>
      );
    }
  });

  return LoadingScreen;
});