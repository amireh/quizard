define(function(require) {
  var Pixy = require('pixy');
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
        hash[question.id] = {};
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

    handleAttribute: function(attr, value, attrs) {
      if (attr === 'answerType') {
        this.questions[attrs.questionId].answerType = value;
      }
    },

    toProps: function() {
      var props = {};

      props.questions = this.questions;

      return props;
    }
  });
});