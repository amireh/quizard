define(function(require) {
  var Pixy = require('pixy');
  var _ = require('ext/underscore');
  var find = _.find;
  var each = _.each;
  var findBy = _.findBy;
  var Model = Pixy.Model;

  /**
   * @class Models.Quiz
   *
   * The Admin or one of them students.
   */
  return Model.extend({
    name: 'QuizTaker',


    initialize: function(quiz) {
      console.assert(quiz, 'You must assign a quiz to the quiz taker.');
      this.quiz = quiz;
      this.questions = quiz.questions.reduce(function(hash, question) {
        hash[question.id] = {
          answers: question.answers.map(function(answer) {
            return { id: answer.id };
          })
        };
        return hash;
      }, {});
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

    prepareAnswers: function() {},

    toJSON: function() {
      // TODO
      return [];
    },

    handleAttribute: function(attr, value, attrs) {
      if (attr === 'answerType') {
        this.questions[attrs.questionId].answerType = value;
      }
      else if (attr === 'responseRatio') {
        var answer;
        var answerId = attrs.answerId;

        each(this.questions, function(question) {
          if (!answer) {
            answer = findBy(question.answers, { id: answerId });
          }
        });

        console.assert(answer, 'Unable to find answer:', answerId);
        answer.responseRatio = value;
      }
    },

    toProps: function() {
      var props = {};

      props.questions = this.questions;

      return props;
    }
  });
});