/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var Radio = require('jsx!components/radio');
  var TooltipsMixin = require('mixins/views/tooltips');
  var QuizTakingActions = require('actions/quiz_taking');
  var GUID = 0;

  var MultipleChoice = React.createClass({
    mixins: [ React.addons.LinkedStateMixin, TooltipsMixin ],

    tooltipOptions: {
      position: {
        my: 'bottom center',
        at: 'top center'
      },
      show: {
        delay: false
      }
    },

    getDefaultProps: function() {
      return {
        answers: []
      };
    },

    render: function() {
      var guid = ++GUID;

      return(
        <div>
          <header>Answers</header>

          <ul className="question-answers">
            {this.props.answers.map(this.renderAnswer)}
          </ul>

          <div>
            <Radio
              onChange={this.setAnswerType}
              value="random"
              checked={this.props.answerType === 'random'}
              name={'answerType' + guid}
              label="Answer randomly" />

            {
              this.props.answerType === 'random' &&
              <div className="margined">
                <button className="btn btn-default btn-mini">Randomize ratios</button>
              </div>
            }
          </div>

          <div>
            <Radio
              onChange={this.setAnswerType}
              value="manual"
              checked={this.props.answerType === 'manual'}
              name={'answerType' + guid}
              label="Specify answer distribution manually" />

              <em className="whatisthis" title={
                  "This option allows you to specify exactly the ratio of " +
                  "responses each answer should receive"
                }>What is this?
              </em>
          </div>
        </div>
      );
    },

    setAnswerType: function(e) {
      QuizTakingActions.set({
        answerType: e.target.value,
        questionId: this.props.id
      });
    },

    renderAnswerDistribution: function(answer) {
      switch(this.props.answerType) {
        case 'random':
          return this.renderDistributionRandomizer(answer);
        break;
        case 'manual':
          return this.renderDistributionPicker(answer);
        break;
      }
    },

    renderAnswer: function(answer) {
      var className = React.addons.classSet({
        'question-answer': true,
        'correct-answer': answer.weight === 100
      });

      return (
        <li className={className} key={answer.id}>
          <div dangerouslySetInnerHTML={{ __html: answer.text }} />

          <div className="actionbar">
            {this.renderAnswerDistribution(answer)}
          </div>
        </li>
      );
    },

    renderDistributionRandomizer: function(answer) {
      var ratio = 0;

      return (
        <label className="form-label">
          {ratio}
        </label>
      );
    },

    renderDistributionPicker: function(answer) {
      return (
        <label className="form-label">
          <input
            className="form-input"
            type="number"
            min="0"
            max="100"
            value={answer.responseRatio || 0}
            onChange={this.setResponseRatio.bind(null, answer.id)} />
        </label>
      );
    },

    setResponseRatio: function(answerId, e) {
      QuizTakingActions.set({
        responseRatio: e.target.value,
        answerId: answerId
      });
    }
  });

  return MultipleChoice;
});