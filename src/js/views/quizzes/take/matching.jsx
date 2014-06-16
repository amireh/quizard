/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var K = require('constants');
  var _ = require('ext/underscore');
  var findBy = _.findBy;
  var Chosen = require('jsx!components/chosen');
  var TooltipsMixin = require('mixins/views/tooltips');
  var RatiosMixin = require('jsx!./mixins/response_ratios');
  var HasVariantsMixin = require('jsx!./mixins/has_variants');
  var RatioRandomizer = require('jsx!./components/ratio_randomizer');
  var RatioControls = require('jsx!./components/ratio_controls');
  var Actions = require('actions/quiz_taking');
  var getAnswers = function(props) {
    return props.answerSets[0].answers;
  };

  var Matching = React.createClass({
    mixins: [ TooltipsMixin, RatiosMixin, HasVariantsMixin ],

    getDefaultProps: function() {
      return {
        matches: []
      };
    },

    render: function() {
      return (
        <div className="matching-question">
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
      var variantAnswer = findBy(variant.answerIds, { answerId: answer.id });
      var matches = [{}].concat(this.props.matches);
      var matchId = variantAnswer ?
        variantAnswer.matchId :
        null;

      return (
        <li key={answer.id} className="question-answer">
          <label>
            <span className="answer-text" children={answer.text} />

            <Chosen
              value={matchId}
              width="340px"
              className="with-arrow"
              onChange={this.addToVariant.bind(null, variant.id, answer.id)}
              children={matches.map(this.renderMatch.bind(null, answer.matchId))} />
          </label>
        </li>
      );
    },

    renderMatch: function(correctMatchId, match) {
      var className = match.id === correctMatchId ? 'correct' : undefined;
      return (
        <option
          className={className}
          key={match.id || 'none'}
          value={match.id}
          children={match.text} />
      );
    },

    addToVariant: function(variantId, answerId, e) {
      var matchId = e.target.value;

      if (!matchId) {
        return;
      }

      Actions.addAnswerToVariant(this.props.id, variantId, {
        answerId: answerId,
        matchId: matchId
      });
    }
  });

  return Matching;
});