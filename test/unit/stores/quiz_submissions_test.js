define(function(require) {
  var PixyJasmine = require('pixy-jasmine');
  var K = require('constants');
  var Store = require('stores/quiz_submissions');
  var Quiz = require('models/quiz');
  var QuizSubmission = require('models/quiz_submission');
  var XHR = require('fixtures/xhr.js');

  describe('Stores.QuizSubmissions', function() {
    var onChange, onError;
    var listener = {
      onChange: function(value) { return value; },
      onError: function(error) { throw error; }
    };

    var quiz = new Quiz({ id: '1' });

    this.promiseSuite = true;
    this.serverSuite = { autoRespond: false };

    beforeEach(function() {
      onChange = spyOn(listener, 'onChange').and.callThrough();
      onError = spyOn(listener, 'onError').and.callThrough();

      spyOn(quiz, 'url').and.returnValue('/courses/1/quizzes/1');
    });

    describe('#create', function() {
      it('should create a submission', function() {
        this.respondWith('POST',
          '/api/v1/courses/1/quizzes/1/submissions',
          XHR(200, {
            quiz_submissions: [{
              id: '1'
            }]
          }));

        Store.create(quiz).then(onChange, onError);

        this.respond();

        expect(onError).not.toHaveBeenCalled();
        expect(onChange).toHaveBeenCalled();
      });

      it('should create a submission as someone else', function() {
        this.respondWith('POST',
          '/api/v1/courses/1/quizzes/1/submissions?as_user_id=10',
          XHR(200, {
            quiz_submissions: [{
              id: '1',
              user_id: '10'
            }]
          }));

        Store.create(quiz, 10).then(onChange, onError);

        this.respond();

        expect(onError).not.toHaveBeenCalled();
        expect(onChange).toHaveBeenCalled();
      });
    });

    describe('#findOrCreate', function() {
      it('should create a submission if one does not exist', function() {
        var createSpy = spyOn(Store, 'create').and.callThrough();

        this.respondWith('GET',
          '/api/v1/courses/1/quizzes/1/submissions/self',
          XHR(404));

        this.respondWith('POST',
          '/api/v1/courses/1/quizzes/1/submissions',
          XHR(200, {
            quiz_submissions: [{
              id: '1'
            }]
          }));

        Store.findOrCreate(quiz).then(onChange, onError);

        this.respond();
        this.respond();

        expect(onError).not.toHaveBeenCalled();
        expect(createSpy).toHaveBeenCalledWith(quiz, undefined, 1);
        expect(onChange).toHaveBeenCalled();
      });
    });

    describe('#saveAnswers', function() {
      it('should save answers as someone else', function() {
        var quiz = new Quiz({ id: 1 });
        var quizSubmission = new QuizSubmission({
          id: 1
        }, { quiz: quiz });

        this.respondWith('POST',
          '/api/v1/quiz_submissions/1/questions?as_user_id=10',
          XHR(200, {
            quiz_submission_questions: []
          }));

        Store.saveAnswers(quizSubmission, 10).then(onChange, onError);

        this.respond();

        expect(onError).not.toHaveBeenCalled();
        expect(onChange).toHaveBeenCalled();
      });
    });
  });
});