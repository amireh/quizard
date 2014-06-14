/** @jsx React.DOM */
define(function(require) {
  var React = require('ext/react');
  var K = require('constants');
  var QuizTakingActions = require('actions/quiz_taking');
  var SaveButton = require('jsx!components/save_button');
  var Question = require('jsx!./take/question');

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

    renderQuestion: function(question, index) {
      return (
        <Question
          key={question.id}
          id={question.id}
          type={question.type}
          text={question.text}
          position={index+1}
          answerType={question.answerType}
          answerSets={question.answerSets}
          variants={question.variants} />
      );
    },

    onSubmit: function(e) {
      e.preventDefault();

      this.trackAction(QuizTakingActions.take());
    }
  });

  return TakeQuiz;
});