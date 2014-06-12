define(function(require) {
  var QuizTaker = require('models/quiz_taker');
  var Quiz = require('models/quiz');
  var QuizData = require('json!fixtures/quiz');
  var QuizQuestionData = require('json!fixtures/quiz_questions');
  var _ = require('ext/underscore');
  var findBy = _.findBy;

  describe('Models.QuizTaker', function() {
    var subject, quiz;

    beforeEach(function() {
      quiz = new Quiz(QuizData);
      quiz.questions.reset(QuizQuestionData);
      spyOn(quiz, 'urlRoot').and.returnValue('/courses/1/quizzes/18');

      subject = window.subject = new QuizTaker({}, { quiz: quiz.toProps() });
    });

    describe('#_findByAnswer', function() {
      it('should locate a question by an answer id', function() {
        expect((subject._findByAnswer('3866') || {}).id).toEqual('11');
      });
    });

    describe('#setResponseRatio', function() {
      it('should accept ratios between 0 and 100', function() {
        subject.setResponseRatio('3866', 40);
        expect(subject._findAnswer('3866').responseRatio).toBe(40);
      });

      it('should distribute overflow', function() {
        var ratioFor = function(answerId) {
          return subject._findAnswer(answerId).responseRatio;
        };

        subject.setResponseRatio('3866', 100);

        expect(ratioFor('3866')).toBe(100);
        expect(ratioFor('2040')).toBe(0);
        expect(ratioFor('7387')).toBe(0);
        expect(ratioFor('4082')).toBe(0);

        subject.setResponseRatio('2040', 20);

        expect(ratioFor('3866')).toBe(80);
        expect(ratioFor('2040')).toBe(20);
        expect(ratioFor('7387')).toBe(0);
        expect(ratioFor('4082')).toBe(0);

        subject.setResponseRatio('3866', 100);

        expect(ratioFor('3866')).toBe(100);
        expect(ratioFor('2040')).toBe(0);
        expect(ratioFor('7387')).toBe(0);
        expect(ratioFor('4082')).toBe(0);

        subject.setResponseRatio('7387', 40);

        expect(ratioFor('3866')).toBe(60);
        expect(ratioFor('2040')).toBe(0);
        expect(ratioFor('7387')).toBe(40);
        expect(ratioFor('4082')).toBe(0);

        subject.setResponseRatio('4082', 20);

        expect(ratioFor('3866')).toBe(50);
        expect(ratioFor('2040')).toBe(0);
        expect(ratioFor('7387')).toBe(30);
        expect(ratioFor('4082')).toBe(20);
      });

      it('should distribute underflow', function() {
        var ratioFor = function(answerId) {
          return subject._findAnswer(answerId).responseRatio;
        };

        subject.setResponseRatio('3866', 60);

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
          var question = findBy(subject.questions, { type: 'short_answer_question' });
          var answer = findBy(question.answers, { id: 'other' });

          expect(answer).toBeTruthy();
        });

        it('should provide the "No Answer" option', function() {
          var question = findBy(subject.questions, { type: 'short_answer_question' });
          var answer = findBy(question.answers, { id: 'none' });

          expect(answer).toBeTruthy();
        });

        it('should yield the answer text for a known answer', function() {
          var question = findBy(subject.questions, { type: 'short_answer_question' });
          var answer = findBy(question.answers, { id: '4684' });
          var responses;

          expect(answer).toBeTruthy();
          subject.setResponseRatio(answer.id, 100);
          responses = subject.generateResponses([{ id: 'self' }]);
          expect(findBy(responses[0].responses, { id: question.id }).answer).
            toEqual('Something');
        });

        it('should yield random text for the "Other Answer" answer', function() {
          var question = findBy(subject.questions, { type: 'short_answer_question' });
          var answer = findBy(question.answers, { id: 'other' });
          var responses;

          expect(answer).toBeTruthy();
          subject.setResponseRatio(answer.id, 100);
          responses = subject.generateResponses([{ id: 'self' }]);
          expect(findBy(responses[0].responses, { id: question.id }).answer.length).
            toBeGreaterThan(1);
        });

        it('should yield an empty string for the "No Answer" answer', function() {
          var question = findBy(subject.questions, { type: 'short_answer_question' });
          var answer = findBy(question.answers, { id: 'none' });
          var responses;

          expect(answer).toBeTruthy();
          subject.setResponseRatio(answer.id, 100);
          responses = subject.generateResponses([{ id: 'self' }]);
          expect(findBy(responses[0].responses, { id: question.id }).answer).
            toEqual('');
        });
      });
    });
  });
});