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

      describe('Essays and Short-Answer', function() {
        it('should pick the "Other" answer and generate garbage', function() {
          var allResponses, myResponses, response;
          var questionId = '18';
          var userId = 'self';

          subject.setResponseRatio(questionId, 'other_' + questionId + '_auto', 100);
          allResponses = subject.generateResponses([ { id: userId } ]);
          myResponses = findBy(allResponses, { id: userId }).responses;
          response = findBy(myResponses, { id: questionId });

          expect(typeof response.answer).toBe('string');
          expect(response.answer.length).toBeGreaterThan(1);
        });

        it('should pick the "No" answer and provide nothing', function() {
          var allResponses, myResponses, response;
          var questionId = '18';
          var userId = 'self';

          subject.setResponseRatio(questionId, [ 'none', questionId, 'auto' ].join('_'), 100);
          allResponses = subject.generateResponses([ { id: userId } ]);
          myResponses = findBy(allResponses, { id: userId }).responses;
          response = findBy(myResponses, { id: questionId });

          expect(response.answer).toBe('');
        });
      });
      describe('Numerical', function() {
        var questionId = '21';
        var userId = 'self';

        it('should choose an exact answer', function() {
          var allResponses, myResponses, response;

          subject.setResponseRatio(questionId, '4343', 100);
          allResponses = subject.generateResponses([ { id: userId } ]);
          myResponses = findBy(allResponses, { id: userId }).responses;
          response = findBy(myResponses, { id: questionId });

          expect(response.answer).toBe(12);
        });

        it('should choose an answer within a range', function() {
          // do it a number of times to make sure the randomizer is functional
          _.range(1000).forEach(function() {
            var allResponses, myResponses, response;

            subject.setResponseRatio(questionId, '6959', 100);
            allResponses = subject.generateResponses([ { id: userId } ]);
            myResponses = findBy(allResponses, { id: userId }).responses;
            response = findBy(myResponses, { id: questionId });

            expect(_.range(3,7)).toContain(response.answer);
          });
        });

        it('should generate a random answer', function() {
          _.range(1000).forEach(function() {
            var allResponses, myResponses, response;

            subject.setResponseRatio(questionId, 'other_21_auto', 100);
            allResponses = subject.generateResponses([ { id: userId } ]);
            myResponses = findBy(allResponses, { id: userId }).responses;
            response = findBy(myResponses, { id: questionId });

            expect(typeof response.answer).toBe('number')
            expect([ 0.5, 1.5, 2.5, 3, 4, 5, 6, 12 ]).not.toContain(response.answer);
          });
        });


        it('should provide no answer', function() {
          var allResponses, myResponses, response;

          subject.setResponseRatio(questionId, 'none_21_auto', 100);
          allResponses = subject.generateResponses([ { id: userId } ]);
          myResponses = findBy(allResponses, { id: userId }).responses;
          response = findBy(myResponses, { id: questionId });

          expect(response.answer).toBe('');
        });

      }); // numerical

    });
  });
});