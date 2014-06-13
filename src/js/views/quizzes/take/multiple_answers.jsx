/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var K = require('constants');
  var Checkbox = require('jsx!components/checkbox');
  var TooltipsMixin = require('mixins/views/tooltips');
  var RatiosMixin = require('jsx!./mixins/response_ratios');
  var RatioRandomizer = require('jsx!./components/ratio_randomizer');
  var RatioControls = require('jsx!./components/ratio_controls');
  var Actions = require('actions/quiz_taking');
  var getAnswers = function(props) {
    return props.answerSets[0].answers;
  };

  var MultipleAnswers = React.createClass({
    mixins: [ TooltipsMixin, RatiosMixin ],

    getDefaultProps: function() {
      return {
        variants: [],
        answerSets: []
      };
    },

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

    renderVariant: function(variant, index) {
      var answers = getAnswers(this.props);

      return (
        <section key={variant.id} className="question-variant">
          <header>
            Variant {index+1}
            {' '}
            {index === 0 ?
              <em
                className="whatisthis"
                children="What is this?"
                title={K.VARIANT_HELP_TOOLTIP} /> :
              <a
                className="whatisthis"
                children="Remove"
                onClick={this.removeVariant.bind(null, variant.id)} />
            }
          </header>

          <ul className="question-answers">
            {answers.map(this.renderAnswer.bind(null, variant))}
          </ul>

          {this.renderRatio(variant, { variant: true })}
        </section>
      );
    },

    renderAnswer: function(variant, answer) {
      var isChecked = variant.answerIds.indexOf(answer.id) !== -1;

      return (
        <li key={answer.id} className="question-answer">
          <Checkbox
            checked={isChecked}
            onChange={this.addToVariant.bind(null, variant.id)}
            value={answer.id}
            label={answer.text} />
        </li>
      );
    },

    addVariant: function(e) {
      e.preventDefault();
      Actions.addVariant(this.props.id);
    },

    removeVariant: function(variantId, e) {
      e.preventDefault();
      Actions.removeVariant(this.props.id, variantId);
    },

    addToVariant: function(variantId, e) {
      var answerId = e.target.value;

      Actions.addAnswerToVariant(this.props.id, variantId, answerId);
    }
  });

  return MultipleAnswers;
});