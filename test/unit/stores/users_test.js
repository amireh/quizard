/* global jasmine:false, sinon:false */
define(function(require) {
  var K = require('constants');
  var Pixy = require('pixy');
  var Account = require('models/account');
  var Accounts = require('stores/accounts');
  var Courses = require('stores/courses');
  var Users = require('stores/users');
  var EnrollmentFixture = require('json!fixtures/enrollment');

  describe('Stores.Users', function() {
    var onChange, onError, onStatusChange;

    describe('USER_MASS_ENROLL', function() {
      var account = new Account({ id: '1' });

      this.serverSuite = { trackRequests: true };
      this.promiseSuite = true;

      beforeEach(function() {
        onChange = jasmine.createSpy('onChange');
        onError = jasmine.createSpy('onError');
        onStatusChange = jasmine.createSpy('onStatusChange');

        spyOn(Accounts, 'getActiveAccountId').and.returnValue('1');
        spyOn(Accounts, 'getUserCollection').and.returnValue(account.users);
        spyOn(Courses, 'getActiveCourseId').and.returnValue('1');
      });

      it('should sign-up as a student and enroll into course', function() {
        Users.on('change:status', onStatusChange);
        Users.onAction(K.USER_MASS_ENROLL, {
          studentCount: 1,
          prefix: 'quizard'
        }, onChange, onError);

        expect(this.requests.length).toEqual(1);
        expect(this.requests[0].url).toEqual('/api/v1/accounts/1/users');
        expect(this.requests[0].requestBody).toEqual(JSON.stringify({
          user: {
            name: 'quizard_1',
          },
          pseudonym: {
            unique_id: 'quizard_1@quizard.com',
            password: 'quizard_1_password',
            send_confirmation: false
          }
        }));

        this.respondTo(this.requests[0], 200, {
          "id": 1,
          "name": "quizard_1",
          "sortable_name": "quizard_1",
          "short_name": "quizard_1",
          "login_id": "quizard_1@quizard.io",
          "locale": null
        });

        this.flush();

        expect(onError).not.toHaveBeenCalled();
        expect(onChange).not.toHaveBeenCalled();
        expect(onStatusChange).toHaveBeenCalled();
        expect(Users.getProgressLog()).toEqual({
          exOperation: 'registration',
          nextOperation: 'enrollment',
          item: '1',
          complete: 1,
          remaining: 1
        });

        expect(this.requests.length).toEqual(2);
        expect(this.requests[1].url).toEqual('/api/v1/courses/1/enrollments');
        expect(this.requests[1].requestBody).toEqual(JSON.stringify({
          enrollment: {
            user_id: '1',
            type: K.USER_STUDENT_ENROLLMENT,
            enrollment_state: 'active',
            notify: false
          }
        }));

        this.respondTo(this.requests[1], 200, EnrollmentFixture);

        this.flush();

        expect(onError).not.toHaveBeenCalled();
        expect(onChange).toHaveBeenCalled();
        expect(onStatusChange).toHaveBeenCalled();
        expect(Users.getProgressLog()).toEqual({
          exOperation: 'enrollment',
          nextOperation: undefined,
          item: '1',
          complete: 2,
          remaining: 0
        });

      });
    });
  });
});