define(function(require) {
  var Pixy = require('pixy');
  var RSVP = require('rsvp');
  var _ = require('ext/underscore');
  var each = _.each;
  var find = _.find;
  var findBy = _.findBy;
  var Model = Pixy.Model;
  var setResponseRatio = require('./quiz_taker/response_ratio_calculator');

  var buildQuestion = function(question) {
    var buildAnswer = function(answer) {
      return {
        id: '' + answer.id,
        responseRatio: answer.weight === 100 ? 100 : 0
      };
    };

    return {
      id: '' + question.id,
      answerType: 'random',
      answers: question.answers.map(buildAnswer)
    };
  };

  /**
   * @class Models.Quiz
   *
   * The Admin or one of them students.
   */
  return Model.extend({
    name: 'QuizTaker',

    initialize: function(attrs, options) {
      console.assert(options.quiz, 'You must assign a quiz to the quiz taker.');
      this.quiz = options.quiz;
      this.questions = this.quiz.questions.map(buildQuestion);
    },

    set: function(attrs) {
      var attr;

      for (attr in attrs) {
        if (attrs.hasOwnProperty(attr)) {
          this.handleAttribute(attr, attrs[attr], attrs);
        }
      }

      return true;
    },

    setResponseRatio: function(answerId, ratio) {
      var question = this._findByAnswer(answerId);

      console.assert(question, 'Unable to find a question with answer:', answerId);

      setResponseRatio(answerId, question.answers, ratio);

      return true;
    },

    prepareAnswers: function() {},

    toJSON: function() {
      // TODO
      return [];
    },

    handleAttribute: function(attr, value, attrs) {
      if (attr === 'answerType') {
        this._findQuestion(attrs.questionId).then(function(question) {
          question.answerType = value;
        });
      }
      else if (attr === 'responseRatio') {
        this.setResponseRatio(attrs.answerId, value);
      }
    },

    toProps: function() {
      var props = {};

      props.questions = this.questions;

      return props;
    },

    _findQuestion: function(questionId) {
      var svc = RSVP.defer();
      var question = findBy(this.questions, { id: questionId });

      if (question) {
        svc.resolve(question);
      }

      return svc.promise;
    },

    _findByAnswer: function(answerId) {
      var questionId, question;
      var locator = { id: '' + answerId };

      return find(this.questions, function(question) {
        return !!findBy(question.answers, locator);
      });
    },

    _findAnswer: function(answerId) {
      var answer;
      var locator = { id: '' + answerId };

      this.questions.some(function(question) {
        answer = findBy(question.answers, locator);

        if (answer) {
          return true
        }
      });

      return answer;
    }
  });
});