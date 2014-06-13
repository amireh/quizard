/** @jsx React.DOM */
define(function(require) {
  var React = require('react');

  var HasAnswersMixin = {
    getDefaultProps: function() {
      return {
        answerSets: []
      };
    },

    renderAnswerSets: function() {
      return (
        <div className="question-answer-sets">
          {this.props.answerSets.map(this.renderAnswerSet)}
        </div>
      );
    },

    renderAnswerSet: function(answerSet) {
      var answers = answerSet.answers;

      return (
        <section key={answerSet.id}>
          <header>{answerSet.id.titleize()}</header>

          <ul className="question-answers">
            {answerSet.answers.map(this.renderAnswer)}
          </ul>
        </section>
      );
    },

    renderAnswer: function(answer) {
      var className = React.addons.classSet({
        'question-answer': true,
        'correct-answer': answer.correct
      });

      return (
        <li className={className} key={answer.id}>
          <div dangerouslySetInnerHTML={{ __html: answer.text }} />
          {this.customAnswerRenderer && this.customAnswerRenderer(answer)}
        </li>
      );
    }
  };

  return HasAnswersMixin;
});