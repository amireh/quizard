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

  var Enroll = React.createClass({
    mixins: [
      React.addons.LinkedStateMixin,
      React.mixins.ActionInitiator,
      TooltipsMixin
    ],

    getInitialState: function() {
      return {
        prefix: undefined,
      };
    },

    getDefaultProps: function() {
      return {
        userStatus: {}
      };
    },

    componentWillReceiveProps: function(nextProps) {
      var thisProps = this.props;
      var done =
        thisProps.userStatus.code === K.USER_ENROLLING &&
        nextProps.userStatus.code === K.STATUS_IDLE;

      if (done) {
        this.refs.saveButton.markDone(true);
      }
    },

    onStoreError: function(storeError) {
      this.refs.saveButton.markDone(false);
    },

    render: function() {
      return(
        <div id="enroll-students" className="column">

          {this.state.storeError &&
            <Alert
              onDismiss={this.clearStoreError}
              className="alert-danger">{this.getStoreError()}</Alert>
          }
          <form onSubmit={this.onSubmit} className="vertical-form">
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

                <div className="column">
                  <input
                    type="text"
                    placeholder="quizard_"
                    valueLink={this.linkState('prefix')}
                    className="form-input input-spanner" />
                </div>
              </label>

              <label className="form-label">
                Number of students

                <div className="column">
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

                <div className="column">
                  <input
                    type="number"
                    min="0"
                    max="5000"
                    valueLink={this.linkState('idRange')}
                    className="form-input" />
                </div>
              </label>
            </fieldset>

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

      svc = Actions.massEnroll(this.state.studentCount, this.state.prefix, this.state.idRange);
      this.trackAction(svc);
    }
  });

  return Enroll;
});