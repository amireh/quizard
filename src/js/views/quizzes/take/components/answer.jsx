/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var classSet = React.addons.classSet;

  var Answer = React.createClass({
    getDefaultProps: function() {
      return {
        text: '',
        correct: false,
        children: false
      };
    },

    render: function() {
      var className = classSet({
        'question-answer': true,
        'correct-answer': this.props.correct
      });

      return (
        <li className={className}>
          <div dangerouslySetInnerHTML={{ __html: this.props.text }} />

          {this.props.children}
        </li>
      );
    }
  });

  return Answer;
});