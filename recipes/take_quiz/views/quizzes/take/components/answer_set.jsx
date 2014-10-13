/** @jsx React.DOM */
define(function(require) {
  var React = require('react');

  var AnswerSet = React.createClass({
    getDefaultProps: function() {
      return {
        id: '',
        noHeader: false,
        children: false
      };
    },

    render: function() {
      return (
        <section key={this.props.id}>
          {!this.props.noHeader && <header>{this.props.id.titleize()}</header>}

          <ul className="question-answers">
            {this.props.children}
          </ul>
        </section>
      );
    }
  });

  return AnswerSet;
});