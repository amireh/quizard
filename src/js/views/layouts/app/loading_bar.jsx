/** @jsx React.DOM */
define([ 'react' ], function(React) {
  var tick;
  var tickTimer = 250;

  function stopTicking() {
    if (tick) {
      clearInterval(tick);
      tick = null;
    }
  }

  var LoadingScreen = React.createClass({
    getInitialState: function() {
      return {
        progress: 0
      };
    },

    componentDidMount: function() {
      tick = setInterval(function() {
        var step;

        if (this.state.progress >= 100) {
          return stopTicking();
        }

        step = Math.floor((Math.random() * 30) + 1);
        this.setState({ progress: this.state.progress + step });
      }.bind(this), tickTimer);
    },

    componentWillUnmount: function() {
      stopTicking();
    },

    render: function() {
      return(
        <div className="loading-indicator progress progress-striped active">
          <div className="bar" style={ {width: this.state.progress + '%'} } />
        </div>
      );
    }
  });

  return LoadingScreen;
});