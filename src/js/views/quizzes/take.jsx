/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var _ = require('underscore');
  var QuizTakingActions = require('actions/quiz_taking');
  var MultipleChoiceRenderer = require('jsx!./take/multiple_choice');
  var merge = _.merge;

  var Renderers = {
    multiple_choice_question: MultipleChoiceRenderer
  };

  var TakeQuiz = React.createClass({
    getDefaultProps: function() {
      return {
        quiz: {
          questions: [],
        },
        quizTaking: {
          questions: {}
        }
      };
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
            <input type="submit" className="btn btn-success" value="Take it" />
          </div>
        </form>
      );
    },

    renderQuestion: function(quizQuestion) {
      var renderer = Renderers[quizQuestion.type];
      var question = merge({}, quizQuestion,
        this.props.quizTaking.questions[quizQuestion.id]);

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