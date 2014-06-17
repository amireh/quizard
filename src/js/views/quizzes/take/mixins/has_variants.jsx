/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var Actions = require('actions/quiz_taking');
  var t = require('i18n!take_quiz');

  var HasVariantsMixin = {
    getDefaultProps: function() {
      return {
        variants: [],
        answerSets: []
      };
    },

    renderVariant: function(variant, index) {
      var answers = this.props.answerSets[0].answers;

      return (
        <section key={variant.id} className="question-variant">
          <header>
            Variant {index+1}
            {' '}
            {index === 0 ?
              <em
                className="whatisthis"
                children="What is this?"
                title={t('tooltips.variants')} /> :
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

    addVariant: function(e) {
      e.preventDefault();
      Actions.addVariant(this.props.id);
    },

    removeVariant: function(variantId, e) {
      e.preventDefault();
      Actions.removeVariant(this.props.id, variantId);
    },
  };

  return HasVariantsMixin;
});