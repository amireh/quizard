/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var K = require('constants');
  var TooltipsMixin = require('mixins/views/tooltips');
  var RatiosMixin = require('jsx!./mixins/response_ratios');
  var RatioControls = require('jsx!./components/ratio_controls');
  var RatioRandomizer = require('jsx!./components/ratio_randomizer');
  var AnswerSet = require('jsx!./components/answer_set');
  var Answer = require('jsx!./components/answer');

  var Essay = React.createClass({
    mixins: [ TooltipsMixin, RatiosMixin ],

    render: function() {
      var answerSet = this.props.answerSets[0];

      return (
        <div>
          <div className="question-answer-sets">
            <AnswerSet noHeader key={answerSet.id} id={answerSet.id}>
              {answerSet.answers.map(this.renderAnswer)}

              {this.props.answerType === 'random' &&
                <div key="randomizer" className="margined">
                  <RatioRandomizer
                    id={this.props.id}
                    answers={answerSet.answers}  />
                </div>
              }
            </AnswerSet>
          </div>

          <div className="question-controls">
            <RatioControls
              id={this.props.id}
              answerType={this.props.answerType} />
          </div>
        </div>
      );
    },

    renderAnswer: function(answer) {
      var text = answer.text === K.QUESTION_UNKNOWN_ANSWER_TEXT ?
        'Something' :
        answer.text;

      return (
        <Answer
          key={answer.id} id={answer.id} text={text}
          correct={answer.correct}
          missing={answer.missing}
          unknown={answer.unknown}
          children={this.renderRatio(answer)} />
      );
    }
  });

  return Essay;
});