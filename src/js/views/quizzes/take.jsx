/** @jsx React.DOM */
define(function(require) {
  var React = require('ext/react');
  var _ = require('underscore');
  var K = require('constants');
  var QuizTakingActions = require('actions/quiz_taking');
  var MultipleChoiceRenderer = require('jsx!./take/multiple_choice');
  var ShortAnswerRenderer = require('jsx!./take/short_answer');
  var FIMBRenderer = require('jsx!./take/fill_in_multiple_blanks');
  var SaveButton = require('jsx!components/save_button');
  var merge = _.merge;
  var findBy = _.findBy;

  var Renderers = {
    multiple_choice_question: MultipleChoiceRenderer,
    true_false_question: MultipleChoiceRenderer,
    short_answer_question: ShortAnswerRenderer,
    fill_in_multiple_blanks_question: FIMBRenderer,
  };

  var TakeQuiz = React.createClass({
    mixins: [ React.mixins.ActionInitiator ],

    getInitialState: function() {
      return {
        succeeded: undefined
      };
    },

    getDefaultProps: function() {
      return {
        quiz: {
          questions: [],
        },
        quizTaking: {}
      };
    },

    componentWillReceiveProps: function(nextProps) {
      var thisProps = this.props;
      var done =
        thisProps.quizTaking.status === K.QUIZ_TAKING_STATUS_TURNING_IN &&
        nextProps.quizTaking.status === K.QUIZ_TAKING_STATUS_IDLE;

      if (done) {
        this.refs.saveButton.markDone(true);
      }
    },

    onStoreError: function() {
      this.refs.saveButton.markDone(false);
    },

    render: function() {
      return(
        <form onSubmit={this.onSubmit} id="take-quiz">
          <header className="content-header">
            {this.props.quiz.name}
          </header>

          <section className="quiz-questions">
            {this.props.quiz.questions.map(this.renderQuestion)}
          </section>

          <div className="form-actions">
            <SaveButton
              ref="saveButton"
              onClick={this.onSubmit}
              type="success"
              children="Take it" />
          </div>
        </form>
      );
    },

    renderQuestion: function(question) {
      var renderer = Renderers[question.type];

      return (
        <fieldset key={question.id}>
          <legend>
            Question {question.position}
            <small className="stick-right">{question.type.replace(/_question$/, '').titleize()}</small>
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
    },

    onSubmit: function(e) {
      e.preventDefault();

      QuizTakingActions.take();
    }
  });

  return TakeQuiz;
});