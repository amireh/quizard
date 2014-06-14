/** @jsx React.DOM */
define([ 'react' ], function(React) {
  var Alert = React.createClass({
    getInitialState: function() {
      return {
        dismissed: false
      };
    },

    componentWillReceiveProps: function() {
      this.setState({ dismissed: false });
    },

    render: function() {
      var className = 'alert';

      if (this.state.dismissed) {
        return <div />;
      }

      if (!this.props.className) {
        className += ' alert-danger';
      }

      return(
        this.transferPropsTo(
          <div className={className}>
            {this.props.children}
            {' '}
            <a className="type-smaller" onClick={this.dismiss}>Dismiss</a>
          </div>
        )
      );
    },

    dismiss: function() {
      this.setState({ dismissed: true });

      if (this.props.onDismiss) {
        this.props.onDismiss();
      }
    }
  });

  return Alert;
});