/** @jsx React.DOM */
define(function(require) {
  var React = require('ext/react');
  var Dialog = require('jsx!components/dialog');
  var Alert = require('jsx!components/alert');
  var CoursePicker = require('jsx!components/course_picker');
  var RouteActions = require('actions/routes');
  var QuizActions = require('actions/quizzes');

  var TakeQuizRecipe = React.createClass({
    mixins: [ React.addons.LinkedStateMixin, React.mixins.ActionInitiator ],

    getInitialState: function() {
      return {
        quizId: null
      };
    },

    render: function() {
      return(
        <Dialog
          thin
          title="Take a Quiz"
          autoFocus=".chosen-search input"
          style={{'text-align': 'left'}}
          onClose={this.props.onClose}
          footer={this.renderActions()}>
          {this.state.error && <Alert onDismiss={this.clearError}>{this.state.error}</Alert> }
          {!this.state.error &&
            <p>
            {"Before we could get started, you need to specify which quiz in \
              what course to take."}
            </p>
          }

          <form className="vertical-form" onSubmit={this.onSubmit} noValidate>
            <fieldset>
              <label className="form-label">Course</label>
              <CoursePicker
                courses={this.props.courses}
                activeCourseId={this.props.activeCourseId} />
            </fieldset>

            <fieldset>
              <label className="form-label">Quiz <em>(id)</em></label>
              <input
                className="form-input"
                type="text"
                placeholder="13"
                valueLink={this.linkState('quizId')} />
              {' '}
            </fieldset>
          </form>
        </Dialog>
      );
    },

    onStoreError: function(storeError) {
      this.setState({ error: storeError.error });
    },

    onSubmit: function(e) {
      e.preventDefault();

      var courseId = this.props.activeCourseId;
      var quizId = this.state.quizId;

      if (!courseId) {
        this.setState({
          error: 'You must choose a course.'
        });
      }
      else if (!quizId) {
        this.setState({ error: 'You must enter the id of the quiz.' });
      }
      else {
        this.trackAction(RouteActions.goToQuiz(courseId, quizId));
      }

      return false;
    },

    clearError: function() {
      this.setState({ error: null });
    },

    renderActions: function() {
      return (
        <div>
          <button className="btn btn-success" onClick={this.onSubmit}>
            Get started
          </button>
        </div>
      );
    }
  });

  return TakeQuizRecipe;
});