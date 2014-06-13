define(function(require) {
  var QuizQuestion = require('models/quiz_question');
  var QuizQuestionData = require('json!fixtures/quiz_questions');
  var _ = require('ext/underscore');
  var pluck = _.pluck;
  var dataFor = function(questionType) {
    var data = QuizQuestionData.filter(function(data) {
      return data.question_type === questionType;
    })[0];

    return JSON.parse(JSON.stringify(data));
  };

  var createQuestion = function(questionType) {
    return new QuizQuestion(dataFor(questionType), { parse: true });
  };

  describe('Models.QuizQuestion', function() {
    var subject;

    beforeEach(function() {
    });

    describe('#parse', function() {
      it('should stringify the id', function() {
        subject = new QuizQuestion({ id: 1 }, { parse: true });
        expect(subject.get('id')).toBe('1');
      });

      it('should wrap "answers" into "answerSets"', function() {
        subject = createQuestion('multiple_choice_question');
        expect(subject.get('answerSets').length).toEqual(1);
        expect(pluck(subject.get('answerSets')[0].answers, 'id')).toEqual([
          '3866', '2040', '7387', '4082'
        ]);
      });

      it('should generate the "Unknown" answer', function() {
        subject = createQuestion('short_answer_question');
        expect(pluck(subject.get('answerSets')[0].answers, 'id').sort()).toEqual([
          '1797', '4684', 'none_15_auto', 'other_15_auto'
        ]);
      });
    });

    describe('#toProps', function() {
      describe('FIMB', function() {
        it('builds answerSets', function() {
          subject = createQuestion('fill_in_multiple_blanks_question');

          var props = subject.toProps();
          expect(props.answerSets.length).toEqual(2);
          expect(pluck(props.answerSets, 'id')).toEqual([ 'color1', 'color2' ]);
        });
      });
    });
  });
});