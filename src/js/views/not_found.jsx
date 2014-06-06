/** @jsx React.DOM */
define([ 'react', 'jsx!components/dialog' ],
function(React, Dialog) {
  var NotFound = React.createClass({
    render: function() {
      return (
        Dialog({
          thin: true,
          title: '404 - Not Found',
          onClose: this.props.onClose,
          children: (
            <p>"We were unable to find the page you were looking for."</p>
          ),
          footer: (
            <button onClick={this.props.onClose} className="btn btn-default">
              Back
            </button>
          )
        })
      );
    }
  });

  return NotFound;
});