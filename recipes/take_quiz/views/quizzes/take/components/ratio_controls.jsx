/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var Actions = require('actions/quiz_taking');
  var t = require('i18n!take_quiz');
  var Radio = require('jsx!components/radio');
  var GUID = 0;

  var RatioControls = React.createClass({
    getDefaultProps: function() {
      return {
        id: undefined,
        answerType: undefined
      };
    },

    render: function() {
      var guid = ++GUID;

      return(
        <div className="question-ratio-controls">
          <header>How should we distribute the responses?</header>

          <Radio
            spanner
            onChange={this.setAnswerType}
            value="random"
            checked={this.props.answerType === 'random'}
            name={'answerType' + guid}
            label="Randomly" />

          <div>
            <Radio
              onChange={this.setAnswerType}
              value="manual"
              checked={this.props.answerType === 'manual'}
              name={'answerType' + guid}
              label="Specify response distribution manually" />

              {' '}

              <em
                className="whatisthis"
                title={t('tooltips.manual_response_distribution')}
                children="What is this?" />
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
  });

  return RatioControls;
});