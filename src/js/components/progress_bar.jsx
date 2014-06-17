/** @jsx React.DOM */
define([ 'react' ], function(React) {
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
        progress: 0
      };
    },

    render: function() {
      var progress = parseInt(this.props.progress || 0, 10);
      var klasses = React.addons.classSet({
        'progress-red': progress > 0 && progress < 25,
        'progress-orange': progress >= 25 && progress < 50,
        'progress-blue': progress >= 50 && progress < 75,
        'progress-green': progress >= 75,
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
    }
  });

  return ProgressBar;
});