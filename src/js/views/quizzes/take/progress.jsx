/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var Dialog = require('jsx!components/dialog');
  var Operation = require('jsx!components/operation_tracker');
  var RouteActions = require('actions/routes');
  var Alert = require('jsx!components/alert');
  var K = require('constants');
  var minimized;

  var Progress = React.createClass({
    getInitialState: function() {
      return {
        title: document.title
      };
    },

    getDefaultProps: function() {
      return {
        quiz: {},
        quizTaking: {}
      };
    },

    componentDidUpdate: function(prevProps, prevState) {
      var completion = parseInt(this.props.quizTaking.ratio || 0, 10);

      if (completion < 100) {
        this.updateTitle('[' + completion + '%]');
      }
      else {
        this.resetTitle();
      }
    },

    updateTitle: function(prefix) {
      document.title = prefix + ' ' + this.state.title;
    },

    resetTitle: function() {
      document.title = this.state.title;
    },

    clearError: function() {
      this.setState({ error: undefined });
    },

    render: function() {
      var error = false;
      var quiz = this.props.quiz;

      var title = (
        <div>
          Generating {this.props.quizTaking.itemCount} submissions for
          {' '}
          <span className="quiz-name course-name" children={quiz.name} />
        </div>
      );

      return(
        <Dialog title={title} onClose={this.backToForm}>
          {error &&
            <Alert
              onDismiss={this.clearError}
              className="alert-danger"
              children={error} />
          }

          {Operation(this.props.quizTaking)}
        </Dialog>
      );
    },

    backToForm: function() {
      RouteActions.goToQuiz(this.props.activeCourse.id, this.props.quiz.id, 'take');
    }
  });

  return Progress;
});