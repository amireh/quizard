define(function(require) {
  var Pixy = require('pixy');
  var RSVP = require('rsvp');
  var result = require('underscore').result;
  var ajax = require('core/ajax');
  var QuizSubmission = require('models/quiz_submission');
  var store;

  var urlForQuestions = function(submission, userId) {
    return [ '', 'quiz_submissions', submission.id, 'questions?as_user_id=' + userId ].join('/');
  };

  var toJSON = function(data) {
    return JSON.stringify(data);
  };

  store = new Pixy.Store('quizSubmissionStore', {
    findOrCreate: function(quiz, userId) {
      var svc = RSVP.defer();
      var quizSubmission = new QuizSubmission({ userId: userId }, { quiz: quiz });

      // TODO: masquerading support

      quizSubmission.fetch({ parse: true }).then(function() {
        if (quizSubmission.isUntaken()) {
          svc.resolve(quizSubmission);
        } else {
          store.create(quiz, userId, quizSubmission.nextAttempt()).then(svc.resolve, svc.reject);
        }
      }, function(apiError) {
        if (apiError.status === 404) {
          store.create(quiz, userId, 1).then(function(quizSubmission) {
            svc.resolve(quizSubmission);
          }, svc.reject);
        }
        else if (apiError.status === 409) {

        }
        else{
          svc.reject(apiError);
        }
      });

      return svc.promise;
    },

    create: function(quiz, userId, attempt) {
      // TODO: masquerading support
      return ajax({
        url: result(quiz, 'url') + '/submissions?as_user_id=' + userId,
        type: 'POST',
        data: toJSON({
          attempt: attempt
        })
      }).then(function(payload) {
        return new QuizSubmission(payload, { quiz: quiz, parse: true });
      });
    },

    saveAnswers: function(quizSubmission, userId, answers) {
      return ajax({
        url: urlForQuestions(quizSubmission, userId),
        type: 'POST',
        data: toJSON({
          attempt: quizSubmission.attempt(),
          validation_token: quizSubmission.validationToken(),
          quiz_questions: answers
        })
      }).then(function() { return quizSubmission; });
    },

    turnIn: function(quizSubmission, userId) {
      return ajax({
        url: quizSubmission.baseUrl() + '/complete',
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