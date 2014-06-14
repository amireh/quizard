/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var Dialog = require('jsx!components/dialog');
  var Operation = require('jsx!components/operation_tracker');
  var RouteActions = require('actions/routes');
  var Alert = require('jsx!components/alert');
  var K = require('constants');

  var Progress = React.createClass({
    getInitialState: function() {
      return {
        error: undefined
      };
    },

    getDefaultProps: function() {
      return {
        enrollment: {},
        courses: []
      };
    },

    componentWillReceiveProps: function(nextProps) {
      if (nextProps.enrollment.error) {
        this.setState({ error: nextProps.enrollment.error });
      }
    },

    getError: function() {
      var loginId = this.props.enrollment.item;

      switch(this.state.error) {
        case K.USER_REGISTRATION_FAILED:
          return (
            <p>
              Unable to register user with login {loginId}.
              This probably means you have already registered a similar user by
              Quizard.

              Try using a higher ID Range or a different ID Prefix.
            </p>
          );
        break;
        case K.USER_ENROLLMENT_FAILED:
          return (
            <p>
              Unable to enroll user with id {loginId}. Make sure the course
              allows self-enrollment!
            </p>
          );
        break;
        default:
          return false;
      }
    },

    clearError: function() {
      this.setState({ error: undefined });
    },

    render: function() {
      var error = this.getError();
      var courseId = this.props.activeCourseId;
      var course = this.props.courses.filter(function(course) {
        return course.id === courseId;
      })[0] || {};

      var title = (
        <div>
          Enrolling {this.props.enrollment.count} students into
          {' '}
          <span className="course-name" children={course.name} />
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

          {Operation(this.props.enrollment)}
        </Dialog>
      );
    },

    backToForm: function() {
      RouteActions.goToUserEnrollment();
    }
  });

  return Progress;
});