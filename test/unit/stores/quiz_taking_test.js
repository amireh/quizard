define(function(require) {
  var Pixy = require('pixy');
  var K = require('constants');
  var Store = require('stores/quiz_taking');
  var Quiz = require('models/quiz');
  var XHR = require('fixtures/xhr.js');

  describe('Stores.QuizTaking', function() {
    var onChange, onError;
    var quiz = new Quiz({ id: '1' });

    beforeEach(function() {
      Store.reset();

      spyOn(quiz, 'url').and.returnValue('/courses/1/quizzes/1');
    });

    describe('QUIZ_TAKING_TAKE', function() {
      this.serverSuite = { autoRespond: false };
      this.promiseSuite = true;

      beforeEach(function() {
        onChange = jasmine.createSpy('onChange');
        onError = jasmine.createSpy('onError');
      });

      it('should take a quiz for the first time', function() {
        Store.build(quiz);

        this.respondWith('GET',
          '/api/v1/courses/1/quizzes/1/submissions/self',
          XHR(200, {
            quiz_submissions: [{
              id: '1',
              workflow_state: 'untaken',
              attempt: 1,
              validation_token: 'foobar'
            }]
          })
        );

        Store.onAction(K.QUIZ_TAKING_TAKE, {}, onChange, onError);

        this.respond();

        this.respondWith('POST',
          '/api/v1/quiz_submissions/1/questions',
          XHR(200, {
            quiz_questions: []
          })
        );

        this.respond();

        this.respondWith('POST',
          '/api/v1/courses/1/quizzes/1/submissions/1/complete',
          XHR(200, {
            quiz_submissions: [{
              id: '1',
              workflow_state: 'complete'
            }]
          })
        );

        this.respond();

        expect(onError).not.toHaveBeenCalled();
        expect(onChange).toHaveBeenCalled();
      });
    });
  });
});