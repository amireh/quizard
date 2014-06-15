/** @jsx React.DOM */
define(function(require) {
  var React = require('ext/react');
  var K = require('constants');
  var Actions = require('actions/quiz_taking');
  var SaveButton = require('jsx!components/save_button');
  var StudentCount = require('jsx!components/student_count');
  var Alert = require('jsx!components/alert');
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
        studentCount: 0,
        quiz: {
          questions: [],
        },
        quizTaking: {
          responseCount: K.USER_MIN_ENROLL
        }
      };
    },

    componentWillReceiveProps: function(nextProps) {
      var thisProps = this.props;
      var done =
        thisProps.quizTaking.status !== K.STATUS_IDLE &&
        nextProps.quizTaking.status === K.STATUS_IDLE;

      if (done) {
        this.refs.saveButton.markDone(true);
      }
    },

    onStoreError: function() {
      this.refs.saveButton.markDone(false);
    },

    render: function() {
      var canTake = this.props.studentCount > 0;

      return(
        <form onSubmit={this.onSubmit} id="take-quiz">
          <header className="content-header">
            {this.props.quiz.name}
          </header>

          {!canTake && <Alert>
              No students are available. You must either enroll some, or
              <a href={K.RECIPE_LOAD_STUDENTS}>load them</a> first.
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
          variants={question.variants} />
      );
    },

    renderActions: function() {
      var canTake = this.props.studentCount > 0;

      return (
        <div className="form-actions">
          {canTake &&
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
            disabled={!canTake}
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