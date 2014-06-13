define(function(require) {
  var Model = require('pixy').Model;
  var setResponseRatio = require('./quiz_taker/response_ratio_calculator');
  var pickAnswer = require('./quiz_taker/answer_picker');
  var findAnswerSet = require('./quiz_taker/find_answer_set');

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
      this.questions = this.quiz.questions;
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
        var question = this.questions.get(''+attrs.questionId);

        if (question) {
          question.set('answerType', value);

          return true;
        } else {
          console.assert(false, 'Unable to locate question with id:', attrs.questionId);
        }
      }
      else if (attr === 'responseRatio') {
        this.setResponseRatio(attrs.answerId, value);

        return true;
      }
    },

    setResponseRatio: function(answerId, ratio) {
      var answerSet = findAnswerSet(answerId, this.questions);

      if (!answerSet) {
        console.assert(false, 'Unable to locate an answer with id:', answerId);
        return false;
      }

      setResponseRatio(answerId, answerSet.answers, ratio);

      return true;
    },

    assignRespondents: function(studentCount) {
      this.questions.forEach(function(question) {
        var remainder;
        var tally = 0;

        question.get('answerSets').forEach(function(answerSet) {
          var answers = answerSet.answers;

          if (!answers.length) {
            return;
          }

          answers.forEach(function(answer) {
            var respondentCount = Math.round(answer.responseRatio / 100 * studentCount);
            tally += answer.remainingRespondents = respondentCount;
          });

          remainder = studentCount - tally;

          // Shove the remaining points into the first one, totally randomly
          if (remainder > 0) {
            answers[0].remainingRespondents += remainder;
          }
        });
      });
    },

    generateResponses: function(students) {
      var questions = this.questions;

      this.assignRespondents(students.length);

      return students.map(function(student) {
        var studentResponses = questions.reduce(function(responses, question) {
          var questionType = question.get('type');
          var answerValue = pickAnswer(question);

          responses.push({
            id: question.get('id'),
            answer: answerValue
          });

          return responses;
        }, []);

        return {
          id: student.id,
          responses: studentResponses
        };
      });
    }
  });
});