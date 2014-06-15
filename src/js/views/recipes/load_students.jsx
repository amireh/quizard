/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var Actions = require('actions/users');
  var K = require('constants');
  var AccountPicker = require('jsx!components/account_picker');
  var SaveButton = require('jsx!components/save_button');
  var StudentCount = require('jsx!components/student_count');
  var Checkbox = require('jsx!components/checkbox');
  var Operation = require('jsx!components/operation_tracker');
  var t = require('i18n!load_students');

  var LoadStudents = React.createClass({
    mixins: [ React.addons.LinkedStateMixin ],

    getInitialState: function() {
      return {
        count: 1
      };
    },

    getDefaultProps: function() {
      return {
        accounts: [],
        activeAccountId: undefined,
        studentStats: {}
      };
    },

    componentDidUpdate: function(prevProps, prevState) {
      if (this.props.userStatus === K.STATUS_IDLE) {
        if (prevProps.userStatus === K.USER_LOADING) {
          this.refs.saveButton.markDone(true);
        } else {
          this.refs.saveButton.reset();
        }
      }
    },

    render: function() {
      var stats = this.props.studentStats;
      var loadLabel = "Load students";

      if (stats.hasMore === true) {
        loadLabel = 'Load more students';
      }

      return(
        <div className="two-columns">
          <header className="content-header">Load Students</header>

          <div className="column">
            {t.htmlSafe('description')}

            <form id="load-students" className="vertical-form" onSubmit={this.onSubmit}>
              <fieldset>
                <legend>{t('labels.account', 'Account')}</legend>

                <p children={t('hints.account',
                  'Choose the account to load the students from.')} />

                <AccountPicker
                  accounts={this.props.accounts}
                  activeAccountId={this.props.activeAccountId} />
              </fieldset>

              <fieldset>
                <legend>{t('labels.student_count', 'Student count')}</legend>

                <StudentCount autoFocus valueLink={this.linkState('count')} />
              </fieldset>

              <fieldset>
                <legend>{t('labels.options', 'Options')}</legend>

                <Checkbox
                  label={t('labels.reset', 'Unload students loaded earlier (e.g, start fresh)')}
                  checkedLink={this.linkState('reset')} />
              </fieldset>

              <div className="form-actions">
                <SaveButton
                  disabled={stats.hasMore === false && !this.state.reset}
                  ref="saveButton"
                  onClick={this.onSubmit}
                  type="primary"
                  children={loadLabel} />
              </div>
            </form>
          </div>

          <div className="column">
            <section>
              <p>
                Loaded students: {stats.availableCount}/{stats.estimatedCount}
                {stats.hasMore && ' (estimated)'}
              </p>
            </section>

            {this.props.studentLoading && Operation(this.props.studentLoading)}
          </div>
        </div>

      );
    },

    onSubmit: function(e) {
      e.preventDefault();

      Actions.load(this.state.count, this.state.reset);
    },

  });

  return LoadStudents;
});