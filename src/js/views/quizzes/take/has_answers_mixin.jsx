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
        answerSets: []
      };
    },

    renderAnswerSets: function() {
      var guid = ++GUID;

      return (
        <div>
          <div className="question-answer-sets">
            {this.props.answerSets.map(this.renderAnswerSet)}
          </div>

          {this.renderControls()}

        </div>
      );
    },

    renderAnswerSet: function(answerSet) {
      var answers = answerSet.answers;

      var generateRandomRatios = function(e) {
        e.preventDefault();

        var answerSz = answers.length;
        var randomAnswer = answers[random(0, answerSz-1)];
        var randomRatio = random(0, 100);

        this.setResponseRatio(randomAnswer.id, { target: { value: randomRatio }});
      }.bind(this);

      return (
        <section key={answerSet.id}>
          <header>{answerSet.id.titleize()}</header>

          <ul className="question-answers">
            {answerSet.answers.map(this.renderAnswer)}
          </ul>

          {
            this.props.answerType === 'random' &&
            <div>
              <button
                onClick={generateRandomRatios}
                className="btn btn-default btn-mini">Randomize ratios</button>
            </div>
          }

        </section>
      );
    },

    renderControls: function() {
      var guid = ++GUID;

      return(
        <div className="question-controls">
          <Radio
            spanner
            onChange={this.setAnswerType}
            value="random"
            checked={this.props.answerType === 'random'}
            name={'answerType' + guid}
            label="Answer randomly" />

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

    renderAnswer: function(answer) {
      var className = React.addons.classSet({
        'question-answer': true,
        'correct-answer': answer.correct
      });

      return (
        <li className={className} key={answer.id}>
          <div dangerouslySetInnerHTML={{ __html: answer.text }} />

          <div className="actionbar">
            {this.renderResponseRatios(answer) }
          </div>
        </li>
      );
    },

    renderResponseRatios: function(answer) {
      return (
        <label className="form-label">
          {
            this.props.answerType === 'random' ?
              answer.responseRatio :
              <input
                className="form-input"
                type="number"
                min="0"
                max="100"
                value={answer.responseRatio}
                onChange={this.setResponseRatio.bind(null, answer.id)} />
          }
        </label>
      );
    },

    setAnswerType: function(e) {
      Actions.set({
        answerType: e.target.value,
        questionId: this.props.id
      });
    },

    setResponseRatio: function(answerId, e) {
      Actions.set({
        responseRatio: e.target.value,
        answerId: answerId
      });
    }
  };

  return HasAnswersMixin;
});