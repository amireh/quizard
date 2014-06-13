/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var TooltipsMixin = require('mixins/views/tooltips');
  var HasAnswersMixin = require('jsx!./has_answers_mixin');
  var Radio = require('jsx!components/radio');
  var random = require('underscore').random;

  var FillInMultipleBlanks = React.createClass({
    mixins: [ React.addons.LinkedStateMixin, TooltipsMixin, HasAnswersMixin ],

    render: function() {
      var guid = this.props.id;

      return (
        <div>
          <div className="question-answer-sets">
            {this.props.answerSets.map(this.renderAnswerSet)}
          </div>

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
        </div>
      );
    }
  });

  return FillInMultipleBlanks;
});