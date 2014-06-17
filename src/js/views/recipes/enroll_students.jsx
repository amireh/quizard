/** @jsx React.DOM */
define(function(require) {
  var React = require('ext/react');
  var Actions = require('actions/users');
  var K = require('constants');
  var SaveButton = require('jsx!components/save_button');
  var Checkbox = require('jsx!components/checkbox');
  var StudentCount = require('jsx!components/student_count');
  var Alert = require('jsx!components/alert');
  var AccountPicker = require('jsx!components/account_picker');
  var CoursePicker = require('jsx!components/course_picker');
  var TooltipsMixin = require('mixins/views/tooltips');
  var generateLogin = require('util/generate_login');
  var generateName = require('util/generate_name');
  var t = require('i18n!enrollment/form');

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
        idRange: 0,
        atomic: false
      };
    },

    getDefaultProps: function() {
      return {
        accounts: [],
        courses: [],
        operation: {}
      };
    },

    componentWillReceiveProps: function(nextProps) {
      var thisProps = this.props;
      var done =
        thisProps.operation.status === K.OPERATION_ACTIVE &&
        nextProps.operation.status !== K.OPERATION_ACTIVE;

      if (done) {
        this.refs.saveButton.markDone(nextProps.operation.status === K.OPERATION_COMPLETE);
      }
      else if (nextProps.operation.status === K.OPERATION_ACTIVE) {
        this.refs.saveButton.markLoading();
      }
    },

    onStoreError: function() {
      this.refs.saveButton.markDone(false);
    },

    getStoreError: function() {
      var errorCode = (this.state.storeError || {}).error;
      var error;

      switch(errorCode) {
        case K.USER_ENROLLMENT_COUNT_TOO_LOW:
          error = t([ 'errors', errorCode ].join('.'));
        break;
        case K.USER_ENROLLMENT_COUNT_TOO_HIGH:
          error = t([ 'errors', errorCode ].join('.'), {
            maxStudentCount: K.USER_MAX_ENROLL
          });
        break;
        default:
      }

      return error;
    },

    render: function() {
      var error = this.getStoreError();

      return(
        <div id="enroll-students">
          <header className="content-header">
            Enroll Students
          </header>

          {error &&
            <Alert
              onDismiss={this.clearStoreError}
              className="alert-danger">{error}</Alert>
          }

          <form onSubmit={this.onSubmit} noValidate className="vertical-form two-columns">
            <div className="column">
              <fieldset>
                <legend>{t('labels.account', 'Account')}</legend>
                <p children={t('hints.account')} />

                <AccountPicker
                  accounts={this.props.accounts}
                  activeAccountId={this.props.activeAccountId} />
              </fieldset>

              <fieldset>
                <legend>{t('labels.course', 'Course')}</legend>
                <p children={t('hints.course')} />

                <CoursePicker
                  courses={this.props.courses}
                  activeCourseId={this.props.activeCourseId} />
              </fieldset>
              <fieldset>
                <legend>{t('labels.options', 'Options')}</legend>

                <Checkbox
                  checkedLink={this.linkState('atomic')}
                  label="Fail as soon as any enrollment fails" />
              </fieldset>
            </div>

            <div className="column">
              <fieldset>
                <legend>{t('labels.student_info', 'Student information')}</legend>

                <label className="form-label">
                  {t('labels.id_prefix', 'ID Prefix')}

                  {' '}

                  <em
                    className="whatisthis"
                    children="What is this?"
                    title={t('tooltips.id_prefix')} />

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

                  <StudentCount
                    autoFocus
                    valueLink={this.linkState('studentCount')} />
                </label>

                <label className="form-label">
                  ID Range

                  {' '}

                  <em
                    className="whatisthis"
                    children="What is this?"
                    title={t('tooltips.id_range')} />

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

            <SaveButton
              manual
              ref="saveButton"
              onClick={this.onSubmit}
              type="primary"
              children="Enroll Students" />
          </form>
        </div>
      );
    },

    onSubmit: function(e) {
      var svc;

      e.preventDefault();

      svc = Actions.massEnroll(this.state.studentCount,
        this.state.idPrefix,
        this.state.idRange,
        !!this.state.atomic);
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