define(function(require) {
  var Model = require('pixy').Model;
  var setResponseRatio = require('./quiz_taker/response_ratio_calculator');
  var pickAnswer = require('./quiz_taker/answer_picker');
  var findAnswerSet = require('./quiz_taker/find_answer_set');
  var _ = require('ext/underscore');
  var findBy = _.findBy;

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
    },

    setVariantResponseRatio: function(questionId, variantId, ratio) {
      var question = this.questions.get(questionId);

      if (!question) {
        return false;
      }

      setResponseRatio(variantId, question.get('variants'), ratio);

      return true;
    },

    setResponseRatio: function(questionId, answerId, ratio) {
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
        var answers = question.getResponsePool();

        answers.forEach(function(answer) {
          var respondentCount = Math.round(answer.responseRatio / 100 * studentCount);
          tally += answer.remainingRespondents = respondentCount;
        });

        remainder = studentCount - tally;

        // Shove the remaining points into the first one, totally randomly
        if (remainder > 0 && answers.length) {
          answers[0].remainingRespondents += remainder;
        }
      });
    },

    generateResponses: function(students) {
      var questions = this.questions;

      this.assignRespondents(students.length);

      return students.map(function(student) {
        var studentResponses = questions.reduce(function(responses, question) {
          return responses.concat({
            id: question.get('id'),
            answer: pickAnswer(question)
          });
        }, []);

        return {
          id: student.id,
          responses: studentResponses
        };
      });
    },

    addAnswerToVariant: function(questionId, variantId, answerId) {
      var question = this.questions.get(questionId);
      var variant, answerIndex;

      if (!question) {
        console.warn('Unable to locate question by id:', questionId);
        return false;
      }

      variant = findBy(question.get('variants'), { id: ''+ variantId });

      if (!variant) {
        console.warn('Unable to locate variant by id:', variantId);
        return false;
      }

      answerIndex = variant.answerIds.indexOf(answerId);

      if (answerIndex !== -1) {
        variant.answerIds.splice(answerIndex, 1);
      } else {
        variant.answerIds.push(answerId);
      }

      return true;
    },

    addVariantToQuestion: function(questionId) {
      this.questions.get(questionId).addVariant();
      return true;
    },

    removeVariantFromQuestion: function(questionId, variantId) {
      this.questions.get(questionId).removeVariant(variantId);
      return true;
    }
  });
});