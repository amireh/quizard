/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var ProgressBar = require('jsx!components/progress_bar');

  var secondsToTime = function(seconds) {
    var floor = function(nr) { return Math.floor(nr); };
    var pad = function(duration) {
      return ('00' + duration).slice(-2);
    };

    if (seconds > 3600) {
      var hh = floor(seconds / 3600);
      var mm = floor((seconds - hh*3600) / 60);
      var ss = seconds % 60;

      return [pad(hh), pad(mm), pad(ss)].join(':');
    } else if (seconds > 0 && seconds < 3600) {
      return [pad(floor(seconds / 60)), pad(floor(seconds % 60))].join(':');
    } else {
      return;
    }
  };

  var OperationTracker = React.createClass({
    getInitialState: function() {
      return {
        eta: 0
      };
    },

    getDefaultProps: function() {
      return {
        count: 0,
        completed: 0,

        item: undefined,
        itemCount: 0,

        action: undefined,
        prevAction: undefined,

        ETA: 0,
        ratio: 0,
        remaining: 0,
        elapsed: 0,
        aps: 0,
        log: []
      };
    },

    componentDidMount: function() {
      this.etaTimer = setInterval(this.start, 1000);
    },

    componentWillReceiveProps: function(nextProps) {
      this.setState({ eta: nextProps.ETA });
    },

    componentWillUnmount: function() {
      this.stop();
    },

    componentDidUpdate: function(prevProps, prevState) {
      if (this.props.remaining === 0) {
        this.stop();
      }
    },

    start: function() {
      this.setState({ eta: this.state.eta - 1 });
    },

    stop: function() {
      if (this.etaTimer) {
        clearInterval(this.etaTimer);
        this.etaTimer = null;
      }
    },

    render: function() {
      return(
        <div className="operation-tracker">
          <header>
            <span className="operation-counter">
              {this.props.remaining}/{this.props.count} items left
            </span>

            <aside className="operation-eta stick-right">
              ETA: {secondsToTime(this.state.eta) || 'N/A'}
            </aside>
          </header>

          <ProgressBar
            key="pbar"
            APS={this.props.aps}
            progress={this.props.ratio} />

          <ul className="operation-log">
            {this.props.log.map(this.renderLogEntry)}
          </ul>
        </div>
      );
    },

    renderLogEntry: function(logEntry) {
      return (
        <li key={logEntry.id}>
          {logEntry.message}

          <span className="operation-log-entry-elapsed">
            [ {logEntry.elapsed}ms ]
          </span>
        </li>
      );
    }
  });

  return OperationTracker;
});