/** @jsx React.DOM */
define(function(require) {
  var React = require('ext/react');
  var _ = require('underscore');
  var Actions = require('actions/users');
  var K = require('constants');
  var AccountPicker = require('jsx!components/account_picker');
  var SaveButton = require('jsx!components/save_button');
  var StudentCount = require('jsx!components/student_count');
  var Checkbox = require('jsx!components/checkbox');
  var Alert = require('jsx!components/alert');
  var Operation = require('jsx!components/operation_tracker');
  var t = require('i18n!load_students');
  var extend = _.extend;

  var LoadStudents = React.createClass({
    mixins: [ React.addons.LinkedStateMixin, React.mixins.ActionInitiator ],

    getInitialState: function() {
      return {
        count: 1
      };
    },

    getDefaultProps: function() {
      return {
        accounts: [],
        activeAccountId: undefined,
        studentStats: {},
        studentLoading: {}
      };
    },

    componentWillReceiveProps: function(nextProps) {
      var success;
      var done =
        this.props.studentLoading.status === K.OPERATION_ACTIVE &&
        nextProps.studentLoading.status !== K.OPERATION_ACTIVE;

      if (done) {
        success = nextProps.studentLoading.status === K.OPERATION_COMPLETE;
        this.refs.saveButton.markDone(success);
      }
    },

    onStoreError: function() {
      this.refs.saveButton.markDone(false);
    },

    formatError: function() {
      switch(this.state.storeError.error) {
        case K.ERROR_ACCOUNT_REQUIRED:
          return <p>You must choose an account first!</p>
        break;
      }
    },

    render: function() {
      var stats = this.props.studentStats;
      var loadLabel = "Load students";
      var canLoadMore = stats.cached || this.state.reset || stats.hasMore !== false;
      var isOperating = !!this.props.studentLoading.name;
      var error = this.state.storeError;

      if (stats.hasMore === true) {
        loadLabel = 'Load more students';
      }

      return(
        <div className="two-columns">
          <header className="content-header">Load Students</header>

          {error && <Alert children={this.formatError()} onDismiss={this.clearStoreError} />}

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
                  disabled={!canLoadMore}
                  ref="saveButton"
                  onClick={this.onSubmit}
                  type="primary"
                  children={loadLabel} />
              </div>
            </form>
          </div>

          <div className="column">
            <section>
              <p className="alert alert-info">
                Loaded students: {stats.availableCount || '?'}/{stats.estimatedCount || '?'}
                {stats.hasMore && ' (estimated)'}
                {stats.cached && ' (from cache)'}
              </p>
            </section>

            {isOperating &&
              Operation(extend({ actionbar: false }, this.props.studentLoading))
            }
          </div>
        </div>

      );
    },

    onSubmit: function(e) {
      e.preventDefault();

      this.trackAction(Actions.load(this.state.count, this.state.reset));
    },

  });

  return LoadStudents;
});