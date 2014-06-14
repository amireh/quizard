/** @jsx React.DOM */
define([ 'react' ], function(React) {
  var MIN_RESOLUTION = 1;
  var MAX_RESOLUTION = 4;
  var DEFAULT_RESOLUTION = 2;

  /**
   * @class Components.ProgressBar
   *
   * A nicely colored horizontal progress bar component.
   */
  var ProgressBar = React.createClass({
    propTypes: {
      progress: React.PropTypes.number
    },

    getDefaultProps: function() {
      return {
        progress: 0,
        APS: 0,
        resolution: DEFAULT_RESOLUTION,
      };
    },

    getInitialState: function() {
      return {
        progress: 0
      };
    },

    setProgress: function(progress) {
      this.setState({
        progress: Math.min(parseInt(progress, 10), 100)
      });
    },

    componentDidMount: function() {
      var interval;
      var resolution = parseInt(this.props.resolution, 10);

      if (resolution > MAX_RESOLUTION || resolution < MIN_RESOLUTION) {
        console.warn(
          'Invalid resolution passed to progress bar.',
          'Value must be between 1 and 4.');

        resolution = DEFAULT_RESOLUTION;
      }

      interval = Math.max(1.0 / resolution * 1000, 250);
      this.normalizer = setInterval(this.tick, interval);
      console.debug('pbar mounted, ticking every:', interval);
    },

    componentWillUnmount: function() {
      this.stop();
    },

    componentWillReceiveProps: function(nextProps) {
      var shouldUpdate, proximityCoefficient;
      var delta = nextProps.progress - this.state.progress;

      // progress must move forwards, discard negative adjustments
      if (delta > 0) {
        proximityCoefficient = this.props.APS * this.props.resolution;

        // don't jump if we're very close to getting there (in < 1second),
        // looks much better
        shouldUpdate = delta >= proximityCoefficient;

        // unless the progress is 100%, then jump
        shouldUpdate = shouldUpdate || nextProps.progress === 100;
      }

      if (shouldUpdate) {
        this.setProgress(nextProps.progress);
      }
    },

    componentDidUpdate: function() {
      if (this.state.progress >= 100) {
        this.stop();
      }
    },

    render: function() {
      var progress = this.state.progress;
      var klasses = React.addons.classSet({
        'progress-red': progress > 0 && progress < 25,
        'progress-orange': progress >= 25 && progress < 50,
        'progress-blue': progress >= 50 && progress < 75,
        'progress-green': progress > 75,
        'progress-bar': true
      });

      var style = {
        width: progress + '%'
      };

      return (
        <div className={klasses}>
          <div className="bar" style={style}></div>
          <span className="ratio">{ progress }%</span>
        </div>
      );
    },

    tick: function() {
      var step;
      var resolution = parseInt(this.props.resolution, 10);

      if (!this.props.APS) {
        console.debug('Will not tick, no resolution or APS specified.');
        return;
      }

      step = this.props.APS / resolution;
      this.setProgress(this.state.progress + step);
    },

    stop: function() {
      if (this.normalizer) {
        clearInterval(this.normalizer);
        this.normalizer = null;
      }
    }
  });

  return ProgressBar;
});