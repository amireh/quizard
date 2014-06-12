/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var Radio = require('jsx!components/radio');
  var Actions = require('actions/quiz_taking');
  var random = require('underscore').random;
  var GUID = 0;

  var HasAnswersMixin = {
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

    renderAnswers: function() {
      return (
        <div>
          <header>Answers</header>

          <ul className="question-answers">
            {this.props.answers.map(this.renderAnswer)}
          </ul>

          {this.renderAnswerTypePickers()}
        </div>
      );
    },

    renderAnswerTypePickers: function() {
      var guid = ++GUID;

      return(
        <div>
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
                <button
                  onClick={this.generateRandomRatios}
                  className="btn btn-default btn-mini">Randomize ratios</button>
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
      Actions.set({
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

      var text = answer.text;

      if (answer.id === 'none') {
        text = '<em>[No Answer]</em>';
      }
      else if (answer.id === 'other') {
        text = '<em>[Something Else]</em>';
      }

      return (
        <li className={className} key={answer.id}>
          <div dangerouslySetInnerHTML={{ __html: text }} />

          <div className="actionbar">
            {this.renderAnswerDistribution(answer)}
          </div>
        </li>
      );
    },

    renderDistributionRandomizer: function(answer) {
      return (
        <label className="form-label">
          {answer.responseRatio}
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
            value={answer.responseRatio}
            onChange={this.setResponseRatio.bind(null, answer.id)} />
        </label>
      );
    },

    setResponseRatio: function(answerId, e) {
      Actions.set({
        responseRatio: e.target.value,
        answerId: answerId
      });
    },

    generateRandomRatios: function(e) {
      e.preventDefault();

      var answerSz = this.props.answers.length;
      var randomAnswer = this.props.answers[random(0, answerSz-1)];
      var randomRatio = random(0, 100);

      this.setResponseRatio(randomAnswer.id, { target: { value: randomRatio }});
    }
  };

  return HasAnswersMixin;
});