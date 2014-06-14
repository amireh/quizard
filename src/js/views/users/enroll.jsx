/** @jsx React.DOM */
define(function(require) {
  var React = require('ext/react');
  var Actions = require('actions/users');
  var K = require('constants');
  var SaveButton = require('jsx!components/save_button');
  var Alert = require('jsx!components/alert');
  var AccountPicker = require('jsx!components/account_picker');
  var CoursePicker = require('jsx!components/course_picker');
  var TooltipsMixin = require('mixins/views/tooltips');
  var generateLogin = require('util/generate_login');
  var generateName = require('util/generate_name');

  var Enroll = React.createClass({
    mixins: [
      React.addons.LinkedStateMixin,
      React.mixins.ActionInitiator,
      TooltipsMixin
    ],

    tooltipOptions: {
      position: {
        my: 'top center',
        at: 'bottom center'
      }
    },

    getInitialState: function() {
      return {
        idPrefix: K.DEFAULT_ID_PREFIX,
        idRange: 0
      };
    },

    getDefaultProps: function() {
      return {
        userStatus: {
          code: K.STATUS_IDLE
        }
      };
    },

    componentWillReceiveProps: function(nextProps) {
      var thisProps = this.props;
      var done =
        thisProps.userStatus.code !== K.STATUS_IDLE &&
        nextProps.userStatus.code === K.STATUS_IDLE;

      if (done) {
        this.refs.saveButton.markDone(!this.state.storeError);
      }
    },

    onStoreError: function(storeError) {
      this.refs.saveButton.markDone(false);
    },

    getStoreError: function() {
      var errorCode = (this.state.storeError || {}).error;

      switch(errorCode) {
        case K.USER_ENROLLMENT_COUNT_TOO_LOW:
          return 'You must want to enroll at least one student.';
        break;
        case K.USER_ENROLLMENT_COUNT_TOO_HIGH:
          return "You can enroll as many as " + K.USER_MAX_ENROLL +
            " students, no more."
        break;
        default:
          return;
      }
    },

    render: function() {
      var error = this.getStoreError();

      return(
        <div id="enroll-students">
          {error &&
            <Alert
              onDismiss={this.clearStoreError}
              className="alert-danger">{error}</Alert>
          }

          <form onSubmit={this.onSubmit} noValidate className="vertical-form two-columns">
            <div className="column">
              <fieldset>
                <legend>Account</legend>
                <p>
                  Users in Canvas must be registered within a specific account.
                  If you happen to have more than one account, please specify
                  the correct one.
                </p>

                <AccountPicker
                  accounts={this.props.accounts}
                  activeAccountId={this.props.activeAccountId} />
              </fieldset>

              <fieldset>
                <legend>Course</legend>
                <p>
                  This would be the course we'll be enrolling the students in.
                </p>

                <CoursePicker
                  courses={this.props.courses}
                  activeCourseId={this.props.activeCourseId} />
              </fieldset>
            </div>

            <div className="column">
              <fieldset>
                <legend>Student information</legend>

                <label className="form-label">
                  ID Prefix

                  {' '}

                  <em className="whatisthis" children="What is this?" title={
                    'Set a prefix that will be used for all the names and emails ' +
                    'of the enrolled students. (Quizard will automatically ' +
                    'generate one for you if you leave this blank.)'
                  } />

                  <div>
                    <input
                      type="text"
                      placeholder="quizard_"
                      valueLink={this.linkState('idPrefix')}
                      className="form-input input-spanner" />
                  </div>
                </label>

                <label className="form-label">
                  Number of students

                  <div>
                    <input
                      type="number"
                      min="0"
                      max="5000"
                      valueLink={this.linkState('studentCount')}
                      className="form-input" />
                    <small className="add-on">Between 1 and 5000</small>
                  </div>
                </label>

                <label className="form-label">
                  ID Range

                  {' '}

                  <em className="whatisthis" children="What is this?" title={
                    'The number that Quizard should start from for generating ' +
                    'IDs for students.'
                  } />

                  <div>
                    <input
                      type="number"
                      min="0"
                      max="5000"
                      pattern="^[0-9]{1,4}$"
                      valueLink={this.linkState('idRange')}
                      className="form-input" />
                  </div>
                </label>

                <p>Student credentials will look something like this:</p>
                {this.generateLoginIdExample()}
              </fieldset>
            </div>

            <SaveButton ref="saveButton" onClick={this.onSubmit} type="primary">
              Enroll Students
            </SaveButton>
          </form>
        </div>
      );
    },

    onSubmit: function(e) {
      var svc;

      e.preventDefault();

      svc = Actions.massEnroll(this.state.studentCount, this.state.idPrefix, this.state.idRange);
      this.trackAction(svc);
    },

    generateLoginIdExample: function() {
      var id = generateLogin(this.state.idPrefix, this.state.idRange);

      var example = {
        loginId: id,
        name: generateName(id),
        email: [ id, K.STUDENT_EMAIL_DOMAIN ].join('@'),
        password: K.STUDENT_PASSWORD
      };

      return (
        <ul>
          <li>Login: <code>{example.loginId}</code></li>
          <li>Name: <code>{example.name}</code></li>
          <li>Email: <code>{example.email}</code></li>
          <li>Password: <code>{example.password}</code></li>
        </ul>
      );
    }
  });

  return Enroll;
});