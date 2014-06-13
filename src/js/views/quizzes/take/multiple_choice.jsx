/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var TooltipsMixin = require('mixins/views/tooltips');
  var RatiosMixin = require('jsx!./mixins/response_ratios');
  var AnswerSet = require('jsx!./components/answer_set');
  var Answer = require('jsx!./components/answer');
  var RatioControls = require('jsx!./components/ratio_controls');
  var RatioRandomizer = require('jsx!./components/ratio_randomizer');

  var MultipleChoice = React.createClass({
    mixins: [ TooltipsMixin, RatiosMixin ],

    getDefaultProps: function() {
      return {
        answerSets: []
      };
    },

    render: function() {
      var answerSet = this.props.answerSets[0];

      return (
        <div>
          <AnswerSet noHeader key={answerSet.id} id={answerSet.id}>
            {answerSet.answers.map(this.renderAnswer)}

            {this.props.answerType === 'random' &&
              <div className="margined">
                <RatioRandomizer
                  id={this.props.id}
                  answers={answerSet.answers}  />
              </div>
            }
          </AnswerSet>

          <RatioControls id={this.props.id} answerType={this.props.answerType} />
        </div>
      );
    },

    renderAnswer: function(answer) {
      return (
        <Answer
          key={answer.id} id={answer.id} text={answer.text}
          correct={answer.correct}
          children={this.renderRatio(answer)} />
      );
    }
  });

  return MultipleChoice;
});