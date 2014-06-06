define([
  'ext/jquery',
  'ext/underscore',
  'jquery.qtip',
  'rsvp'
], function($, _, qTip, RSVP) {
  'use strict';

  var $body;

  /**
   * @class Modules.FormError
   * Decorate form fields with error messages.
   */

  /**
   * @method FormError
   * @constructor
   *
   * Create a form error to present a single API error which may contain several
   * field errors.
   *
   * > **Note**
   * >
   * > You don't have to manually manage existing form errors as the FormError
   * > clears any previously attached form errors (to that view) when you create
   * > it.
   *
   * @param {Pixy.View} view
   *        The view holding the form. Needed for proper clean-up.
   *
   * @param {Object} apiError
   *        An object containing API error that must have the "field_errors"
   *        map.
   *
   * @param {jQuery} [$form=view.$('form')]
   *        The form element.
   *
   * @param {Boolean} [autoShow=true]
   *        Pass to true to prevent the form error from showing automatically,
   *        then you're responsible for showing them using #show.
   *
   *
   * **Example:**
   *
   *     Pixy.View.extend({
   *       onSaveObject: function() {
   *         var that = this;
   *
   *         this.object.save().otherwise(function(apiError) {
   *           new FormError(that, apiError);
   *         });
   *       }
   *     });
   */
  var FormError = function(view, apiError, options) {
    var error = apiError;
    var service;

    if (!error || !error.fieldErrors) {
      console.error('Expected API error to contain a "fieldErrors" map:', error);
      return this;
    }

    service =  RSVP.defer();

    options = this.options = _.extend({}, this.defaults, {
      // $form: view.$('form'),
      autoShow: true,
      single: false
    }, options);

    this.$form = this.locateForm($(view.$el), $(options.$form));

    // Extract the fields and get a selector to their form elements:
    this.fieldErrors = this.prepareFieldErrors(error.fieldErrors, this.$form, options.single);

    if (options.autoShow) {
      _.defer(_.bind(this.show, this, service));
    }

    this.promise = service.promise;

    return this;
  };

  _.extend(FormError.prototype, {

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

    formatMessage: function(code, message) {
      return message;
    },

    show: function(resolver) {
      var options = this.options.qtip;

      this.fieldErrors.forEach(function(fieldError) {
        var $field = fieldError.$field;
        var message = fieldError.message;
        var qTipOptions = _.extend({}, options, {
          content: {
            text: message
          }
        });

        $field.addClass('invalid');
        fieldError.qtip = $field.qtip(qTipOptions).qtip('api');

        // i've tried to debug and couldn't nail it: sometimes qTip is just not
        // rendering for some reason and not doing such a test is breaking other
        // things so we'll just guard against it:
        if (fieldError.qtip) {
          fieldError.qtip.show();
        }
      });

      if (resolver) {
        resolver.resolve(this);
      }

      return true;
    },

    clear: function() {
      _.each(this.fieldErrors, function(fieldError) {
        fieldError.$field.removeClass('invalid');
        // see my comment above in #show
        if (fieldError.qtip) {
          fieldError.qtip.destroy(true);
        }
      });

      return RSVP.resolve();
    },

    locateForm: function($el, $candidate) {
      if ($candidate && $candidate.is('form')) {
        return $candidate;
      }
      else if ($el.is('form')) {
        return $el;
      }
      else {
        return $el.closest('form');
      }
    },

    prepareFieldErrors: function(fieldErrors, $form, single) {
      return _.chain(_.pairs(fieldErrors)).map(function(pair, index) {
        if (single && index > 0) {
          return null;
        }

        var field = pair[0];
        var error = pair[1];
        var $field = $form.find('[name="' + _.escape(field) + '"]');

        if (!$field) {
          console.warn('No form field found for', pair[0], '=>', error);
          return null;
        }

        return {
          field: field,
          message: this.formatMessage(error.code, error.message),
          $field: $field
        };
      }, this).compact().value();
    }
  });

  $(function() {
    $body = $('body');
  });

  return FormError;
});