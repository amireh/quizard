/** @jsx React.DOM */
define(function(require) {
  var React = require('ext/react');
  var K = require('constants');
  var Actions = require('actions/quiz_taking');
  var SaveButton = require('jsx!components/save_button');
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
      var saveDone =
        thisProps.quizTaking.status === K.QUIZ_TAKING_STATUS_TURNING_IN &&
        nextProps.quizTaking.status === K.QUIZ_TAKING_STATUS_IDLE;

      var loadDone =
        thisProps.quizTaking.status === K.QUIZ_TAKING_LOADING_STUDENTS &&
        nextProps.quizTaking.status === K.QUIZ_TAKING_STATUS_IDLE;

      if (saveDone) {
        this.refs.saveButton.markDone(true);
      }
      else if (loadDone) {
        this.refs.loadButton.markDone(true);
      }
    },

    onStoreError: function() {
      this.refs.saveButton.markDone(false);
      this.refs.loadButton.markDone(false);
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
              load them first.
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
              Student count
              <div>
                <input
                  className="form-input"
                  type="number"
                  min="1" max={this.props.studentCount}
                  onChange={this.setResponseCount}
                  value={this.props.quizTaking.responseCount} />

                <span>
                  {this.props.studentCount} students are available
                </span>
              </div>
            </label>
          }

          <SaveButton
            ref="saveButton"
            onClick={this.onSubmit}
            disabled={!canTake}
            type="success"
            children="Take it" />

          {' '}

          <SaveButton
            ref="loadButton"
            onClick={this.onLoadStudents}
            type="default"
            children="Load students" />
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
    },

    onLoadStudents: function(e) {
      e.preventDefault();

      this.trackAction(Actions.loadStudents());
    }
  });

  return TakeQuiz;
});