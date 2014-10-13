/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var Actions = require('actions/quiz_taking');

  var Options = React.createClass({
    getInitialState: function() {
      return {
        visible: false
      };
    },

    render: function() {
      return (
        <div className="options-menu">
          <button
            onClick={this.toggle}
            className="btn btn-default icon-cog stick-right" />

          <ul
            style={{ display: this.state.visible ? 'inherit' : 'none' }}
            className="menu">
            <li>
              <button onClick={this.onRandomize} className="a11y-btn">
                Randomize all ratios
              </button>
            </li>
          </ul>
        </div>
      );
    },

    toggle: function(e) {
      e.preventDefault();
      this.setState({ visible: !this.state.visible });
    },

    onRandomize: function(e) {
      e.preventDefault();
      Actions.randomizeRatios();
    }
  });

  return Options;
});