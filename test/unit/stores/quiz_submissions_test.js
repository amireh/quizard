define(function(require) {
  var PixyJasmine = require('pixy-jasmine');
  var K = require('constants');
  var Store = require('stores/quiz_submissions');
  var Quiz = require('models/quiz');
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

  });
});