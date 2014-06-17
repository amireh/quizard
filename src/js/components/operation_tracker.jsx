/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var K = require('constants');
  var ProgressBar = require('jsx!components/progress_bar');
  var t = require('i18n!operations');
  var OperationActions = require('actions/operations');
  var secondsToTime = require('util/seconds_to_time');

  var OperationTracker = React.createClass({
    getInitialState: function() {
      return {
        ETA: 0,
      };
    },

    getDefaultProps: function() {
      return {
        actionbar: true,
        count: 0,
        completed: 0,
        item: undefined,
        itemCount: 0,
        action: undefined,
        ETA: 0,
        ratio: 0,
        log: []
      };
    },

    componentDidMount: function() {
      this.etaTimer = setInterval(this.updateETA, 1000);
    },

    componentWillReceiveProps: function(nextProps) {
      this.setState({ ETA: nextProps.ETA });
    },

    componentWillUnmount: function() {
      this.stop();
    },

    componentDidUpdate: function(prevProps) {
      var done =
        prevProps.status === K.OPERATION_ACTIVE &&
        this.props.status !== K.OPERATION_ACTIVE;

      if (done) {
        this.stop();
      }
    },

    updateETA: function() {
      this.setState({ ETA: this.state.ETA - 1 });
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
            {this.renderStatus()}
            {this.renderRemainder()}
            {this.renderFailures()}

            <aside className="operation-eta stick-right">
              ETA: {secondsToTime(this.state.ETA) || 'N/A'}
            </aside>
          </header>

          <ProgressBar
            key="progressBar"
            ref="progressBar"
            APS={this.props.APS}
            progress={this.props.ratio}
            active={this.props.status === K.OPERATION_ACTIVE} />

          <ul className="operation-log">
            {this.props.log.map(this.renderLogEntry)}
          </ul>

          {this.props.actionbar &&
            <div className="operation-actions">
              <button
                disabled={this.props.status !== K.OPERATION_ACTIVE}
                className="btn btn-danger"
                onClick={this.onAbort}>
                Abort
              </button>
            </div>
          }
        </div>
      );
    },

    renderRemainder: function() {
      if (this.props.count === 0) {
        return <span className="operation-counter" children="-" />;
      }

      return (
        this.props.remaining === 0 ?
        <span className="operation-counter">
          Done in {this.props.elapsed} seconds
        </span> :
        <span className="operation-counter">
          {this.props.remaining || 0}/{this.props.count} operations left
        </span>
      );
    },

    renderStatus: function() {
      var status;

      if (this.props.status === K.OPERATION_ABORTED) {
        status = t('statuses.aborted', '[ ABORTED ] ');
      }
      else if (this.props.status === K.OPERATION_FAILED) {
        status = t('statuses.failed', '[ FAILED ] ');
      }

      return status ?
        <span className="operation-status" children={status} /> :
        false;
    },

    renderFailures: function() {
      if (this.props.failed > 0) {
        return [
          <span> - </span>,
          <span className="operation-failure-counter">
            {t('failures', { count: this.props.failed })}
          </span>
        ];
      }
    },

    renderLogEntry: function(logEntry) {
      return (
        <li key={logEntry.id} className={logEntry.failed ? 'failed' : null}>
          {logEntry.failed && <span>[FAILED] </span>}

          {logEntry.message}

          <span className="operation-log-entry-elapsed">
            {logEntry.elapsed}s
          </span>
        </li>
      );
    },

    onAbort: function(e) {
      e.preventDefault();

      if (confirm(t('confirmations.aborting'))) {
        OperationActions.abort(this.props.id);
      }
    }
  });

  return OperationTracker;
});