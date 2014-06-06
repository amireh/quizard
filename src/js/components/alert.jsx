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
      if (this.state.dismissed) {
        return <div />;
      }

      return(
        this.transferPropsTo(
          <p className="alert">
            {this.props.children}
            {' '}
            <a className="type-smaller" onClick={this.dismiss}>Dismiss</a>
          </p>
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