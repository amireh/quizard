define(function(require) {
  var subject, quiz;

  var QuizTaker = require('models/quiz_taker');
  var Quiz = require('models/quiz');
  var QuizData = require('json!fixtures/quiz');
  var QuizQuestionData = require('json!fixtures/quiz_questions');
  var _ = require('ext/underscore');
  var findBy = _.findBy;
  var findAnswerSet = require('models/quiz_taker/find_answer_set');
  var findAnswer = function(answerId) {
    return findBy(findAnswerSet(answerId, subject.questions).answers, { id: answerId });
  };
  var findQuestion = function(id) {
    return subject.questions.get(id);
  };

  describe('Models.QuizTaker', function() {

    beforeEach(function() {
      quiz = new Quiz(JSON.parse(JSON.stringify(QuizData)));
      quiz.questions.reset(JSON.parse(JSON.stringify(QuizQuestionData)));
      spyOn(quiz, 'urlRoot').and.returnValue('/courses/1/quizzes/18');

      subject = new QuizTaker({}, { quiz: quiz });
    });

    describe('#setResponseRatio', function() {
      it('should accept ratios between 0 and 100', function() {
        subject.setResponseRatio('11', '3866', 40);
        expect(findAnswer('3866').responseRatio).toBe(40);
      });

      it('should distribute overflow', function() {
        var ratioFor = function(answerId) {
          return findAnswer(answerId).responseRatio;
        };

        subject.setResponseRatio('11', '3866', 100);

        expect(ratioFor('3866')).toBe(100);
        expect(ratioFor('2040')).toBe(0);
        expect(ratioFor('7387')).toBe(0);
        expect(ratioFor('4082')).toBe(0);

        subject.setResponseRatio('11', '2040', 20);

        expect(ratioFor('3866')).toBe(80);
        expect(ratioFor('2040')).toBe(20);
        expect(ratioFor('7387')).toBe(0);
        expect(ratioFor('4082')).toBe(0);

        subject.setResponseRatio('11', '3866', 100);

        expect(ratioFor('3866')).toBe(100);
        expect(ratioFor('2040')).toBe(0);
        expect(ratioFor('7387')).toBe(0);
        expect(ratioFor('4082')).toBe(0);

        subject.setResponseRatio('11', '7387', 40);

        expect(ratioFor('3866')).toBe(60);
        expect(ratioFor('2040')).toBe(0);
        expect(ratioFor('7387')).toBe(40);
        expect(ratioFor('4082')).toBe(0);

        subject.setResponseRatio('11', '4082', 20);

        expect(ratioFor('3866')).toBe(50);
        expect(ratioFor('2040')).toBe(0);
        expect(ratioFor('7387')).toBe(30);
        expect(ratioFor('4082')).toBe(20);
      });

      it('should distribute underflow', function() {
        var ratioFor = function(answerId) {
          return findAnswer(answerId).responseRatio;
        };

        subject.setResponseRatio('11', '3866', 60);

        expect(ratioFor('3866')).toBe(60);
        expect(ratioFor('2040')).toBe(14);
        expect(ratioFor('7387')).toBe(13);
        expect(ratioFor('4082')).toBe(13);
      });
    });

    describe('#generateResponses', function() {
      it('should provide an answer to a Multiple-Choice question', function() {
        var responses = subject.generateResponses([ { id: 'self' } ]);
        var myResponses = responses[0].responses;

        expect(myResponses[0].answer).toBe('3866');
      });

      describe('ShortAnswer', function() {
        it('should provide the "Other Answer" option', function() {
          var question = findQuestion(15);
          var answer = findAnswer('other_15_auto');

          expect(answer).toBeTruthy();
        });

        it('should provide the "No Answer" option', function() {
          var question = findQuestion(15);
          var answer = findAnswer('none_15_auto');

          expect(answer).toBeTruthy();
        });

        it('should yield the answer text for a known answer', function() {
          var question = findQuestion(15);
          var answer = findAnswer('4684');
          var responses;

          expect(answer).toBeTruthy();
          subject.setResponseRatio('15', answer.id, 100);
          responses = subject.generateResponses([{ id: 'self' }]);
          expect(findBy(responses[0].responses, { id: question.id }).answer).
            toEqual('Something');
        });

        it('should yield random text for the "Other Answer" answer', function() {
          var question = findQuestion(15);
          var answer = findAnswer('other_15_auto');
          var responses;

          expect(answer).toBeTruthy();
          subject.setResponseRatio('15', answer.id, 100);
          responses = subject.generateResponses([{ id: 'self' }]);
          expect(findBy(responses[0].responses, { id: question.id }).answer.length).
            toBeGreaterThan(1);
        });

        it('should yield an empty string for the "No Answer" answer', function() {
          var question = findQuestion(15);
          var answer = findAnswer('none_15_auto');
          var responses;

          expect(answer).toBeTruthy();
          subject.setResponseRatio('15', answer.id, 100);
          responses = subject.generateResponses([{ id: 'self' }]);
          expect(findBy(responses[0].responses, { id: question.id }).answer).
            toEqual('');
        });
      });

      describe('FIMB', function() {
        it('should build a blank set', function() {
          var question = findQuestion(16);
          var studentResponses = subject.generateResponses([ { id: 'self' } ]);
          var myResponses = findBy(studentResponses[0].responses, { id: '16' });

          expect(myResponses.answer).toEqual({
            color1: 'Red',
            color2: 'bonkers'
          });
        });
      });

      describe('Multiple-Dropdowns', function() {
        it('should build a set with variables against answer ids', function() {
          var question = findQuestion(19);
          var studentResponses = subject.generateResponses([ { id: 'self' } ]);
          var myResponses = findBy(studentResponses[0].responses, { id: '19' });

          expect(myResponses.answer).toEqual({
            organ: '3208',
            color: '1381'
          });
        });
      });

    });
  });
});