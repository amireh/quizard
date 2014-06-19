define([ 'rsvp', 'modules/form_error' ], function(RSVP, FormError) {
  'use strict';

  /**
   * @class React.FormErrorsMixin
   *
   * Provides component helpers for rendering form errors.
   *
   * The mixin expects the host to track the actionIndex in its state for the
   * actions it performs for which form errors should be shown. This is usually
   * done using the ActionInitiator mixin.
   */
  return {
    getInitialState: function() {
      return {
        actionIndex: undefined
      };
    },

    getDefaultProps: function() {
      return {
        storeError: undefined
      };
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
      apiError = apiError || {};

      if (apiError.responseText) {
        apiError = JSON.parse(apiError.responseText);
      }

      if (this.formatFormError) {
        apiError = this.formatFormError(apiError);
      }

      return this.clearFormError().then(function() {
        this.formError = new FormError(this.refs.form.getDOMNode(), apiError);

        return this.formError.promise;
      }.bind(this)).catch(function(e) {
        console.error('Unable to show form errors:', e.stack ? e.stack : e);
      });
    },

    clearFormError: function() {
      var formError = this.formError;

      if (formError) {
        this.formError = null;
        return formError.clear();
      } else {
        return RSVP.resolve();
      }
    },

    /**
     * @return {Boolean} Are there any form errors currently presented?
     */
    hasFormError: function() {
      return !!this.formError;
    }
  };
});