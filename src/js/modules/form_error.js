define([
  'ext/jquery',
  'underscore',
  'jquery.qtip',
  'rsvp'
], function($, _, qTip, RSVP) {
  'use strict';

  var extend = _.extend;
  var defer = _.defer;
  var pairs = _.pairs;
  var compact = _.compact;
  var escape = _.escape;

  /**
   * @class Modules.FormError
   * Decorate form fields with error messages using qTip tooltips.
   */

  /**
   * @method FormError
   * @constructor
   * @async
   *
   * Create a form error to present a single API error which may contain several
   * field errors. A field error when present is expected to map to an <input />
   * with a corresponding [name] attribute. So, an error for the "name" property
   * expects an <input name="name" /> to exist in the form.
   *
   * > **Note**
   * >
   * > You don't have to manually manage existing form errors as the FormError
   * > clears any previously attached form errors (to that view) when you create
   * > it.
   *
   * @param {jQuery} $form (required)
   *        The form element to decorate.
   *
   * @param {Object} apiError
   *        An object containing API error that must have the "fieldErrors"
   *        map.
   *
   * @param {Object} options
   *
   * @param {Boolean} [options.single=false]
   *        Pass true if you want only the first field error to be shown.
   *
   * @param {Boolean} [options.autoShow=true]
   *        Pass false to prevent the form error from showing automatically,
   *        then you're responsible for showing them using #show.
   *
   *        WARNING: if autoShow is true, it will still defer the call to
   *        show the form errors to the next tick. Be wary of this when you're
   *        testing!
   *
   * **Example:**
   *
   *     var $form = $('<form />');
   *
   *     someAPICall().catch(function(apiError) {
   *       new FormError($form, apiError);
   *     });
   *
   * **API error synopsis:**
   *
   * {
   *   "fieldErrors": {
   *     "prop1": {
   *       "code": "PROP1_ERR_CODE",
   *       "message": "prop1 error message"
   *     }
   *   }
   * }
   *
   * The error code is optional. If the API provides it, you will get to utilize
   * it in FormError#formatMessage. For example, to translate the message.
   *
   * At least one of the error message or code must be present to display the
   * error.
   */
  var FormError = function($form, apiError, options) {
    var service;
    var error = apiError;

    if (!error || !error.fieldErrors) {
      console.error('Expected API error to contain a "fieldErrors" map:', error);
      return this;
    }

    service =  RSVP.defer();

    this.options = extend({}, this.defaults, {
      autoShow: true,
      single: false
    }, options);

    this.$form = $form;

    // Extract the fields and get a selector to their form elements:
    this.formFields = this.prepareFormFields(error.fieldErrors, this.options.single);

    if (this.options.autoShow) {
      defer(this.show.bind(this, service.resolve));
    }

    this.promise = service.promise;

    return this;
  };

  extend(FormError.prototype, {
    /**
     * @property {Promise}
     * A promise to be fulfilled once this form error has been shown.
     */
    promise: null,

    defaults: {
      autoShow: true,

      qtip: {
        prerender: false,
        hide: {
          event: 'focus blur'
        },
        show: {
          event: null
        },
        position: {
          my: 'bottom center',
          at: 'top center'
        },
        api: {
          hidden: function(event, api) {
            api.destroy();
          }
        }
      }
    },

    /**
     * Override this if you need to do i18n work.
     *
     * @param  {String} [code=null]
     * @param  {String} message
     * @return {String}
     *         The error message to show for the field.
     */
    formatMessage: function(code, message) {
      return message;
    },

    show: function(resolve) {
      var options = this.options.qtip;

      this.formFields.forEach(function(formField) {
        var $field = formField.$field;
        var error = formField.error;
        var qTipOptions = extend({}, options, {
          content: {
            text: error
          }
        });

        $field.addClass('invalid');
        formField.qtip = $field.qtip(qTipOptions).qtip('api');

        // i've tried to debug and couldn't nail it: sometimes qTip is just not
        // rendering for some reason and not doing such a test is breaking other
        // things so we'll just guard against it:
        if (formField.qtip) {
          formField.qtip.show();
        }
      });

      if (resolve) {
        resolve(this);
      }

      return true;
    },

    clear: function() {
      this.formFields.forEach(function(formField) {
        formField.$field.removeClass('invalid');

        // see my comment above in #show
        if (formField.qtip) {
          formField.qtip.destroy(true /* immediately */);
        }
      });

      return RSVP.resolve();
    },

    prepareFormFields: function(fieldErrors, single) {
      var $form = this.$form;
      var formatMessage = this.formatMessage.bind(this);
      var formFields = pairs(fieldErrors).map(function(pair, index) {
        var name, error, $field;

        if (single && index > 0) {
          return;
        }

        name = pair[0];
        error = pair[1];
        $field = $form.find('[name="' + escape(name) + '"]');

        if (!$field) {
          console.warn('No form field found for', pair[0], '=>', error);
          return;
        }

        return {
          error: formatMessage(error.code, error.message),
          $field: $field
        };
      });

      return compact(formFields);
    }
  });

  return FormError;
});