/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var Actions = require('actions/quiz_taking');
  var Ratio = require('jsx!../components/ratio');

  var RatiosMixin = {
    getDefaultProps: function() {
      return {
        answerType: undefined
      };
    },

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
          <Ratio
            onChange={this.setRatio.bind(null, answer.id, options)}
            readOnly={this.props.answerType === 'random'}
            value={answer.responseRatio} />
        </div>
      );
    },

    setRatio: function(answerId, options, e) {
      var ratio = e.target.value;

      Actions.setResponseRatio(this.props.id, answerId, ratio, options);
    }
  };

  return RatiosMixin;
});