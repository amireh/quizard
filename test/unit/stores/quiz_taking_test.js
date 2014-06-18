define(function(require) {
  var Pixy = require('pixy');
  var K = require('constants');
  var Store = require('stores/quiz_taking');
  var Quizzes = require('stores/quizzes');
  var Users = require('stores/users');
  var Quiz = require('models/quiz');
  var XHR = require('fixtures/xhr.js');

  describe('Stores.QuizTaking', function() {
    var onChange, onError;
    var quiz;

    beforeEach(function() {
      Store.reset();
      Quizzes.reset();

      quiz = Quizzes.collection.push({ id: '1' });

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
        Store.build(quiz.toProps());
        spyOn(Users, 'getAll').and.returnValue([{ id: '1' }]);

        this.respondWith('GET',
          '/api/v1/courses/1/quizzes/1/submissions/self?as_user_id=1',
          XHR(200, {
            quiz_submissions: [{
              id: '1',
              workflow_state: 'untaken',
              attempt: 1,
              validation_token: 'foobar'
            }]
          })
        );

        Store.onAction(K.QUIZ_TAKING_SET_RESPONSE_COUNT, {
          count: 1
        }, onChange, onError);

        Store.onAction(K.QUIZ_TAKING_TAKE, {
          atomic: true
        }, onChange, onError);

        this.respond();

        this.respondWith('POST',
          '/api/v1/quiz_submissions/1/questions?as_user_id=1',
          XHR(200, {
            quiz_questions: []
          })
        );

        this.respond();

        this.respondWith('POST',
          '/api/v1/courses/1/quizzes/1/submissions/1/complete?as_user_id=1',
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