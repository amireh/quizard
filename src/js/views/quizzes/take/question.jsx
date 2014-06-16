/** @jsx React.DOM */
define(function(require) {
  var React = require('react');

  var MultipleChoiceRenderer = require('jsx!./multiple_choice');
  var ShortAnswerRenderer = require('jsx!./short_answer');
  var FIMBRenderer = require('jsx!./fill_in_multiple_blanks');
  var MultipleAnswersRenderer = require('jsx!./multiple_answers');
  var EssayRenderer = require('jsx!./essay');
  var NumericalRenderer = require('jsx!./numerical');
  var CalculatedRenderer = require('jsx!./calculated');
  var MultipleDropdownsRenderer = require('jsx!./multiple_dropdowns');

  var Renderers = {
    multiple_choice_question: MultipleChoiceRenderer,
    true_false_question: MultipleChoiceRenderer,
    short_answer_question: ShortAnswerRenderer,
    fill_in_multiple_blanks_question: FIMBRenderer,
    multiple_answers_question: MultipleAnswersRenderer,
    essay_question: EssayRenderer,
    numerical_question: NumericalRenderer,
    calculated_question: CalculatedRenderer,
    multiple_dropdowns_question: MultipleDropdownsRenderer,
  };

  var Question = React.createClass({
    statics: {
      getRenderer: function(props) {
        return Renderers[props.type] || false;
      },

      getName: function(props) {
        return props.type.replace(/_question$/, '').titleize();
      }
    },

    render: function() {
      var question = this.props;
      var renderer = this.type.getRenderer(question);

      return (
        <fieldset>
          <legend>
            Question {question.position}
            <small className="stick-right">{this.type.getName(question)}</small>
          </legend>

          {question.text ?
            <div dangerouslySetInnerHTML={{ __html: question.text }} /> :
            <p><em>No question text available.</em></p>
          }

          {
            renderer ?
              renderer(question) :
              <em>Question type is not supported yet.</em>
          }
        </fieldset>
      );
    }
  });

  return Question;
});