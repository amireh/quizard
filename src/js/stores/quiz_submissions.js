define(function(require) {
  var Pixy = require('pixy');
  var RSVP = require('rsvp');
  var ajax = require('core/ajax');
  var masquerade = require('util/masquerade');
  var QuizSubmission = require('models/quiz_submission');
  var store;

  var toJSON = function(data) {
    return JSON.stringify(data);
  };

  store = new Pixy.Store('quizSubmissionStore', {
    findOrCreate: function(quiz, userId) {
      var svc = RSVP.defer();
      var quizSubmission = new QuizSubmission({ userId: userId }, { quiz: quiz });

      quizSubmission.fetch({
        parse: true,
        url: masquerade(quizSubmission.url(), userId)
      }).then(function() {
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
        else{
          svc.reject(apiError);
        }
      });

      return svc.promise;
    },

    create: function(quiz, userId, attempt) {
      var quizSubmission = new QuizSubmission({
        attempt: attempt
      }, {
        quiz: quiz
      });

      return quizSubmission.save(undefined, {
        parse: true,
        url: masquerade(quizSubmission.url(), userId)
      });
    },

    saveAnswers: function(quizSubmission, userId, answers) {
      return ajax({
        url: masquerade(quizSubmission.questionsUrl(), userId),
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
        url: masquerade(quizSubmission.url() + '/complete', userId),
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