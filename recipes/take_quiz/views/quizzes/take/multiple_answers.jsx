/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var Checkbox = require('jsx!components/checkbox');
  var TooltipsMixin = require('mixins/views/tooltips');
  var RatiosMixin = require('jsx!./mixins/response_ratios');
  var HasVariantsMixin = require('jsx!./mixins/has_variants');
  var RatioRandomizer = require('jsx!./components/ratio_randomizer');
  var RatioControls = require('jsx!./components/ratio_controls');
  var Actions = require('actions/quiz_taking');

  var MultipleAnswers = React.createClass({
    mixins: [ TooltipsMixin, RatiosMixin, HasVariantsMixin ],

    render: function() {
      return (
        <div>
          {this.props.variants.map(this.renderVariant)}

          <div className="question-controls btn-group">
            <button
              onClick={this.addVariant}
              className="btn btn-default btn-mini margined">
              Add a variant
            </button>

            <RatioRandomizer
              id={this.props.id}
              answers={this.props.variants}
              variant />

            <RatioControls id={this.props.id} answerType={this.props.answerType} />
          </div>
        </div>
      );
    },

    renderAnswer: function(variant, answer) {
      var isChecked = variant.answerIds.indexOf(answer.id) !== -1;
      var className = React.addons.classSet({
        'question-answer': true,
        'correct-answer': answer.correct
      });

      return (
        <li key={answer.id} className={className}>
          <Checkbox
            checked={isChecked}
            onChange={this.addToVariant.bind(null, variant.id)}
            value={answer.id}
            label={answer.text} />
        </li>
      );
    },

    addToVariant: function(variantId, e) {
      var answerId = e.target.value;

      Actions.addAnswerToVariant(this.props.id, variantId, answerId);
    }
  });

  return MultipleAnswers;
});