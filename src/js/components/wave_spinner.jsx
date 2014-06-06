/** @jsx React.DOM */
define([ 'react' ], function(React) {
  var WaveSpinner = React.createClass({
    render: function() {
      return(
        <div className="wave-spinner">
          <div className="rect1"></div>
          <div className="rect2"></div>
          <div className="rect3"></div>
          <div className="rect4"></div>
          <div className="rect5"></div>
        </div>
      );
    }
  });

  return WaveSpinner;
});