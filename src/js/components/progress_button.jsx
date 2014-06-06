/** @jsx React.DOM */
define([ 'react' ], function(React) {
  var classSet = React.addons.classSet;
  var STATE_IDLE = 1;
  var STATE_LOADING = 2;
  var filler;

  /**
   * @class Components.ProgressButton
   *
   * A button that turns into a loading indicator when pushed.
   */
  var ProgressButton = React.createClass({
    propTypes: {
      children: React.PropTypes.renderable,
      className: React.PropTypes.string,
      onClick: React.PropTypes.func.isRequired
    },

    getInitialState: function() {
      return {
        buttonState: STATE_IDLE,
        progress: 0
      };
    },

    getDefaultProps: function() {
      return {
        className: ''
      };
    },

    componentDidMount: function() {
    },

    componentWillUnmount: function() {
      this.stopFilling();
    },

    componentDidUpdate: function() {
      if (this.state.progress >= 100) {
        this.stopFilling();
        this.setState({
          buttonState: STATE_IDLE,
          progress: 0
        });
      }
      else if (this.state.progress === 0) {
        if (this.state.buttonState === STATE_LOADING) {
          this.startFilling();
        }
      }
    },

    render: function() {
      var fill = false;
      var klasses = {
        'btn': true,
        'progress-button': true,
        'state-loading': this.state.buttonState === STATE_LOADING,
        'perspective': !fill
      };
      var progressStyle = {
        width: this.state.progress + '%'
      };

      return (
        <button
          onClick={this.click}
          data-horizontal
          data-style={fill ? 'fill' : 'rotate-angle-bottom' }
          disabled={this.state.buttonState === STATE_LOADING}
          className={[classSet(klasses), this.props.className].join(' ')}>
          <span className={fill ? '' : "progress-wrap"}>
            <span className="content">
              {this.props.children || 'Save'}
            </span>
            <span className="progress">
              <span style={progressStyle} className="progress-inner"></span>
            </span>
          </span>
        </button>);
    },

    click: function(e) {
      this.toggleState();
      this.props.onClick(e);
    },

    toggleState: function() {
      var nextState;

      switch(this.state.buttonState) {
        case STATE_IDLE: nextState = STATE_LOADING; break;
        case STATE_LOADING: nextState = STATE_IDLE; break;
      }

      this.setState({
        buttonState: nextState
      });
    },

    startFilling: function() {
      this.stopFilling();
      filler = setInterval(function() {
        var chunk = Math.floor((Math.random() * 30) + 1);

        console.debug('ProgressButton:', this.state.progress);

        this.setState({
          progress: this.state.progress + chunk
        });
      }.bind(this), 250);
    },

    stopFilling: function() {
      if (filler) {
        clearInterval(filler);
        filler = null;
      }
    }
  });

  return ProgressButton;
});