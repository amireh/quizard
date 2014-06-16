define(function(require) {
  var Pixy = require('pixy');
  var result = require('underscore').result;

  var getId = function(quizSubmission) {
    return quizSubmission.get('id') || 'self';
  };

  var Model = Pixy.Model;
  /**
   * @class Models.Quiz
   *
   * The Admin or one of them students.
   */
  return Model.extend({
    name: 'QuizSubmission',

    urlRoot: function(dontMasquerade) {
      return result(this.quiz, 'url') + '/submissions';
    },

    questionsUrl: function() {
      return '/quiz_submissions/' + getId(this) + '/questions';
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