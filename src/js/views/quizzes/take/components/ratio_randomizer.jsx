/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var Actions = require('actions/quiz_taking');
  var _ = require('underscore');
  var random = _.random;
  var sample = _.sample;

  /**
   * Render a button that randomizes the current response ratios of all
   * answers in a given answerSet's "answers" array.
   *
   * @param  {QuizQuestion.Answer[]} answers
   *         This is what you find in quizQuestion.answerSets[n].answers.
   *
   * @return {React.DOM.button}
   */
  var RatioRandomizer = React.createClass({
    getDefaultProps: function() {
      return {
        id: undefined,
        answers: [],
        variant: false
      };
    },

    /**
     * Render a button that randomizes the current response ratios of all
     * answers in a given answerSet's "answers" array.
     *
     * @param  {QuizQuestion.Answer[]} answers
     *         This is what you find in quizQuestion.answerSets[n].answers.
     *
     * @return {React.DOM.button}
     */
    render: function() {
      return (
        <button
          onClick={this.randomize}
          className="btn btn-default btn-mini"
          children="Randomize ratios" />
      );
    },

    randomize: function(e) {
      e.preventDefault();

      var answers = this.props.answers;
      var randomAnswer = sample(answers);
      var randomRatio = random(0, 100);
      var options = {
        variant: this.props.variant
      };

      Actions.setResponseRatio(this.props.id, randomAnswer.id, randomRatio, options);
    }
  });

  return RatioRandomizer;
});