/** @jsx React.DOM */
define(function(require) {
  var React = require('ext/react');
  var K = require('constants');
  var Actions = require('actions/quiz_taking');
  var SaveButton = require('jsx!components/save_button');
  var StudentCount = require('jsx!components/student_count');
  var Alert = require('jsx!components/alert');
  var Question = require('jsx!./take/question');
  var t = require('i18n!take_quiz');
  var TakeQuiz = React.createClass({
    mixins: [ React.mixins.ActionInitiator ],

    getInitialState: function() {
      return {
        succeeded: undefined
      };
    },

    getDefaultProps: function() {
      return {
        studentCount: 0,
        quiz: {
          questions: [],
        },
        quizTaking: {
          responseCount: K.USER_MIN_ENROLL
        },
        operation: {}
      };
    },

    componentWillReceiveProps: function(nextProps) {
      var thisProps = this.props;
      var success;
      var done =
        thisProps.operation.status === K.OPERATION_ACTIVE &&
        nextProps.operation.status !== K.OPERATION_ACTIVE;

      if (done) {
        success = nextProps.operation.status === K.OPERATION_COMPLETE;
        this.refs.saveButton.markDone(success);
      }
    },

    onStoreError: function() {
      this.refs.saveButton.markDone(false);
    },

    formatError: function() {
      var errorCode = this.state.storeError.error;

      if (errorCode === K.QUIZ_TAKING_RESPONSE_GENERATION_FAILED) {
        return t('response_generation_failed');
      } else {
        return t('unexpected_error', {
          errorCode: errorCode,
        });
      }
    },

    render: function() {
      var canTake = this.props.studentCount > 0;

      return(
        <form onSubmit={this.onSubmit} id="take-quiz">
          <header className="content-header">
            {this.props.quiz.name}
          </header>

          {!canTake &&
            <Alert>
              No students are available. You must either enroll some, or
              <a href={K.RECIPE_LOAD_STUDENTS}> load them</a> first.
            </Alert>
          }

          {this.state.storeError &&
            <Alert>
              {this.formatError()}
            </Alert>
          }

          <section className="quiz-questions">
            {this.props.quiz.questions.map(this.renderQuestion)}
          </section>

          {this.renderActions()}
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
          variants={question.variants}
          matches={question.matches} />
      );
    },

    renderActions: function() {
      var hasStudents = this.props.studentCount > 0;
      var hasResponseCount = this.props.quizTaking.responseCount > 0;

      return (
        <div className="form-actions">
          {hasStudents &&
            <label className="form-label">
              Number of participants

              <StudentCount
                max={this.props.studentCount}
                onChange={this.setResponseCount}
                value={this.props.quizTaking.responseCount} />
            </label>
          }

          <SaveButton
            ref="saveButton"
            onClick={this.onSubmit}
            disabled={!hasStudents || !hasResponseCount}
            type="success"
            children="Take it" />
        </div>
      );
    },

    setResponseCount: function(e) {
      e.preventDefault();

      Actions.setResponseCount(e.target.value || 1);
    },

    onSubmit: function(e) {
      e.preventDefault();

      this.trackAction(Actions.take());
    }
  });

  return TakeQuiz;
});