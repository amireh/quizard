/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var Actions = require('actions/quiz_taking');
  var random = require('underscore').random;

  var randomize = function(answers, options, e) {
    e.preventDefault();

    var answerSz = answers.length;
    var randomAnswer = answers[random(0, answerSz-1)];
    var randomRatio = random(0, 100);

    this.setRatio(randomAnswer.id, options, randomRatio);
  };

  var RatiosMixin = {
    /**
     * Render the response ratio for a specific answer.
     *
     * This would either be an input field if the answerType is set to manual,
     * otherwise it's a static element.
     *
     * @param  {QuizQuestion.Answer} answer
     *
     * @return {React.DOM.div}
     */
    renderRatio: function(answer, options) {
      return(
        <div className="actionbar">
          <label className="form-label input-append">
            <input
              className="form-input"
              type="number"
              min="0"
              max="100"
              readOnly={this.props.answerType === 'random'}
              value={answer.responseRatio}
              onChange={this.setRatio.bind(null, answer.id, options)} />
            <span className="add-on">%</span>
          </label>
        </div>
      );
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
    renderRatioRandomizer: function(answers, options) {
      return this.props.answerType === 'random' &&
        <button
          onClick={randomize.bind(this, answers, options)}
          className="btn btn-default btn-mini"
          children="Randomize ratios" />;
    },

    setRatio: function(answerId, options, e) {
      var ratio = typeof e === 'object' ? e.target.value : e;

      Actions.setResponseRatio(this.props.id, answerId, ratio, options);
    }
  };

  return RatiosMixin;
});