define(function(require) {
  var Pixy = require('pixy');
  var result = require('underscore').result;

  var Model = Pixy.Model;
  /**
   * @class Models.Quiz
   *
   * The Admin or one of them students.
   */
  return Model.extend({
    name: 'QuizSubmission',

    baseUrl: function() {
      var id = this.get('id') || 'self';
      return [ result(this.quiz, 'url'), 'submissions', id ].join('/');
    },

    url: function() {
      var url = this.baseUrl();
      var userId = this.get('userId');

      if (userId) {
        url += '?as_user_id=' + userId;
      }

      return url;
    },

    initialize: function(attrs, options) {
      this.quiz = options.quiz;
    },

    parse: function(payload) {
      return payload.quiz_submissions[0];
    },

    isUntaken: function() {
      return this.get('workflow_state') === 'untaken';
    },

    attempt: function() {
      return this.get('attempt');
    },

    validationToken: function() {
      return this.get('validation_token');
    },

    nextAttempt: function() {
      return this.get('attempt') + 1;
    }
  });
});