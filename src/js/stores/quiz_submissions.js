define(function(require) {
  var Pixy = require('pixy');
  var RSVP = require('rsvp');
  var result = require('underscore').result;
  var ajax = require('core/ajax');
  var QuizSubmission = require('models/quiz_submission');
  var store;

  var urlForQuestions = function(submission) {
    return [ '', 'quiz_submissions', submission.id, 'questions' ].join('/');
  };

  var toJSON = function(data) {
    return JSON.stringify(data);
  };

  store = new Pixy.Store('quizSubmissionStore', {
    findOrCreate: function(quiz, user) {
      var svc = RSVP.defer();
      var quizSubmission = new QuizSubmission({}, { quiz: quiz });

      // TODO: masquerading support

      quizSubmission.fetch({ parse: true }).then(
        function() {
          if (quizSubmission.isUntaken()) {
            svc.resolve(quizSubmission);
          } else {
            store.create(quiz, user, quizSubmission.nextAttempt())
              .then(svc.resolve, svc.reject);
          }
        },
        function(apiError) {
          if (apiError.status === 404) {
            store.create(quiz, user, 1).then(function(quizSubmission) {
              svc.resolve(quizSubmission);
            }, svc.reject);
          } else {
            svc.reject(apiError);
          }
        });

      return svc.promise;
    },

    create: function(quiz, user, attempt) {
      // TODO: masquerading support
      return ajax({
        url: result(quiz, 'url') + '/submissions',
        type: 'POST',
        data: toJSON({
          attempt: attempt
        })
      }).then(function(payload) {
        return new QuizSubmission(payload, { quiz: quiz, parse: true });
      });
    },

    saveAnswers: function(quizSubmission, answers) {
      return ajax({
        url: urlForQuestions(quizSubmission),
        type: 'POST',
        data: toJSON({
          attempt: quizSubmission.attempt(),
          validation_token: quizSubmission.validationToken(),
          quiz_questions: answers
        })
      }).then(function() { return quizSubmission; });
    },

    turnIn: function(quizSubmission) {
      return ajax({
        url: quizSubmission.url() + '/complete',
        type: 'POST',
        data: toJSON({
          attempt: quizSubmission.attempt(),
          validation_token: quizSubmission.validationToken()
        })
      });
    }
  });

  return store;
});