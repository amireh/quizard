define(function(require) {
  var Model = require('pixy').Model;
  var K = require('constants');
  var _ = require('ext/underscore');
  var find = _.find;
  var findBy = _.findBy;
  var contains = _.contains;
  var pick = _.pick;
  var setResponseRatio = require('./quiz_taker/response_ratio_calculator');
  var pickAnswer = require('./quiz_taker/answer_picker');

  var buildAnswer = function(answer) {
    return {
      id: '' + answer.id,
      text: answer.text,
      correct: answer.weight === 100,
      remainingRespondents: 0,
      responseRatio: 0
    };
  };

  var buildOtherAnswer = function() {
    return buildAnswer({ id: 'none' });
  };

  var buildNoAnswer = function() {
    return buildAnswer({ id: 'other' });
  };

  var buildQuestion = function(question) {
    var answers = question.answers.map(buildAnswer);

    if (contains(K.FREE_FORM_INPUT_QUESTIONS, question.type)) {
      answers.push(buildNoAnswer());
      answers.push(buildOtherAnswer());
    }

    return {
      id: '' + question.id,
      type: question.type,
      answerType: 'random',
      answers: answers,
      getNextAnswer: function() {
        return find(this.answers, function(answer) {
          return answer.remainingRespondents > 0;
        });
      }
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
      this.questions.forEach(function(question) {
        var correctAnswer;
        var answers = question.answers;

        if (answers.length) {
          correctAnswer = findBy(answers, { correct: true }) || answers[0];
          this.setResponseRatio(correctAnswer.id, 100);
        }
      }.bind(this));
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

    assignRespondents: function(studentCount) {
      this.questions.forEach(function(question) {
        var remainder;
        var tally = 0;
        var answers = question.answers;

        if (!answers.length) {
          return;
        }

        answers.forEach(function(answer) {
          var respondentCount = Math.round(answer.responseRatio / 100 * studentCount);
          tally += answer.remainingRespondents = respondentCount;
        });

        remainder = studentCount - tally;

        if (remainder > 0) {
          answers[0].remainingRespondents += remainder;
        }
      });
    },

    generateResponses: function(students) {
      var questions = this.questions;

      this.assignRespondents(students.length);

      return students.map(function(student) {
        var studentResponses = questions.reduce(function(responses, question) {
          var answer = question.getNextAnswer();
          var answerValue = pickAnswer(question.type, answer);

          if (answer) {
            answer.remainingRespondents -= 1;
          }

          return responses.concat({
            id: question.id,
            answer: answerValue
          });
        }, []);

        return {
          id: student.id,
          responses: studentResponses
        };
      });
    },

    // addCustomAnswer: function(questionId) {
    //   var svc = RSVP.defer();

    //   this._findQuestion('' + questionId).then(function(question) {
    //     if (!contains(K.FREE_FORM_INPUT_QUESTIONS, question.type)) {
    //       return svc.reject('Question type does not support custom answers.');
    //     }

    //     question.answers.push(buildAnswer({ id: uniqueId() }));
    //   }, svc.reject);
    // },

    toJSON: function() {
      // TODO
      return [];
    },

    handleAttribute: function(attr, value, attrs) {
      if (attr === 'answerType') {
        var question = this._findQuestion(attrs.questionId);

        if (question) {
          question.answerType = value;
          return true;
        }
      }
      else if (attr === 'responseRatio') {
        this.setResponseRatio(attrs.answerId, value);
        return true;
      }
    },

    toProps: function() {
      var props;

      props = {};
      props.questions = this.questions.map(function(question) {
        var questionProps;

        questionProps = pick(question, 'id', 'answerType');
        questionProps.answers = question.answers.map(function(answer) {
          return pick(answer, 'id', 'responseRatio');
        });

        return questionProps;
      });

      return props;
    },

    _findQuestion: function(questionId) {
      return findBy(this.questions, { id: questionId });
    },

    _findByAnswer: function(answerId) {
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
          return true;
        }
      });

      return answer;
    }
  });
});