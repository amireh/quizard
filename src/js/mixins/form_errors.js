define([ 'underscore', 'jquery', 'rsvp', 'modules/form_error' ],
function(_, $, RSVP, FormError) {
  'use strict';

  /**
   * @class React.FormErrorsMixin
   *
   * Provides component helpers for rendering form errors.
   */
  return {
    getDefaultProps: function() {
      return {};
    },

    getInitialState: function() {
      return {};
    },

    componentWillUnmount: function() {
      this.clearFormError();
    },

    componentDidMount: function() {
      if (!this.refs.form) {
        throw "Component must define a 'form' ref to use FormErrorsMixin.";
      }
    },

    componentDidUpdate: function() {
      var storeError = this.props.storeError;

      if (storeError && storeError.actionIndex === this.state.actionIndex) {
        this.showFormError(storeError.error);
      }
    },

    /**
     * Create and attach an API error presenter to this view's form.
     *
     * See Modules.FormError for more info.
     *
     * @async
     * @param  {Object} apiError
     *         A well-formed API error that contains a "field_errors" map of
     *         errors.
     *
     * @return {Promise}
     *         Of the form being decorated with the error tooltips.
     */
    showFormError: function(apiError) {
      if (apiError.responseText) {
        apiError = JSON.parse(apiError.responseText);
      }

      return this.clearFormError().then(function() {
        this.formError = new FormError({}, apiError, {
          $form: this.refs.form.getDOMNode()
        });

        return this.formError.promise;
      }.bind(this)).catch(function(e) {
        console.error('Unable to show form errors:', e.stack ? e.stack : e);
      });
    },

    clearFormError: function() {
      if (this.formError) {
        return this.formError.clear().finally(function() {
          this.formError = null;
        }.bind(this));
      }

      return RSVP.resolve();
    },

    /**
     * @return {Boolean} Are there any form errors currently presented?
     */
    hasFormError: function() {
      return !!this.formError;
    }
  };
});