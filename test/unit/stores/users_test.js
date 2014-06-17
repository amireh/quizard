/* global jasmine:false, sinon:false */
define(function(require) {
  var K = require('constants');
  var Pixy = require('pixy');
  var Account = require('models/account');
  var Accounts = require('stores/accounts');
  var Courses = require('stores/courses');
  var Operations = require('stores/operations');
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
        Operations.on('change', onStatusChange);
        Users.onAction(K.USER_MASS_ENROLL, {
          studentCount: 1,
          prefix: 'quizard'
        }, onChange, onError);

        this.flush();

        expect(this.requests.length).toEqual(1);
        expect(this.requests[0].url).toEqual('/api/v1/accounts/1/users');
        expect(this.requests[0].requestBody).toEqual(JSON.stringify({
          user: {
            name: 'Quizard 1',
          },
          pseudonym: {
            unique_id: 'quizard_1@quizard.com',
            password: K.STUDENT_PASSWORD,
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
        // expect(Users.getProgressLog()).toEqual({
        //   exOperation: 'registration',
        //   nextOperation: 'enrollment',
        //   item: '1',
        //   complete: 1,
        //   remaining: 1
        // });

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
        // expect(Users.getProgressLog()).toEqual({
        //   exOperation: 'enrollment',
        //   nextOperation: undefined,
        //   item: '1',
        //   complete: 2,
        //   remaining: 0
        // });

      });

      it('should work for multiple students', function() {
        Operations.on('change', onStatusChange);
        Users.onAction(K.USER_MASS_ENROLL, {
          studentCount: 2,
          prefix: 'quizard',
          idRange: 0
        }, onChange, onError);

        this.flush();

        // Regionstration of user 1 (loginId: "quizard_1")
        expect(this.requests.length).toEqual(1);
        expect(this.requests[0].url).toEqual('/api/v1/accounts/1/users');
        expect(this.requests[0].requestBody).toEqual(JSON.stringify({
          user: {
            name: 'Quizard 1',
          },
          pseudonym: {
            unique_id: 'quizard_1@quizard.com',
            password: K.STUDENT_PASSWORD,
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

        expect(onError).not.toHaveBeenCalled();
        expect(onChange).not.toHaveBeenCalled();
        expect(onStatusChange).toHaveBeenCalled();
        // expect(Users.getProgressLog()).toEqual({
        //   exOperation: 'registration',
        //   nextOperation: 'enrollment',
        //   item: '1',
        //   complete: 1,
        //   remaining: 3
        // });

        // Enrollment of user1
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

        expect(onError).not.toHaveBeenCalled();
        expect(onChange).not.toHaveBeenCalled();
        expect(onStatusChange).toHaveBeenCalled();
        // expect(Users.getProgressLog()).toEqual({
        //   exOperation: 'enrollment',
        //   nextOperation: 'registration',
        //   item: '1',
        //   complete: 2,
        //   remaining: 2
        // });

        // Registration of user 2 (loginId: "quizard_2")
        expect(this.requests.length).toEqual(3);
        expect(this.requests[2].url).toEqual('/api/v1/accounts/1/users');
        expect(this.requests[2].requestBody).toEqual(JSON.stringify({
          user: {
            name: 'Quizard 2',
          },
          pseudonym: {
            unique_id: 'quizard_2@quizard.com',
            password: K.STUDENT_PASSWORD,
            send_confirmation: false
          }
        }));

        this.respondTo(this.requests[2], 200, {
          "id": 2,
          "name": "quizard_2",
          "sortable_name": "quizard_2",
          "short_name": "quizard_2",
          "login_id": "quizard_2@quizard.io",
          "locale": null
        });

        expect(onStatusChange).toHaveBeenCalled();
        // expect(Users.getProgressLog()).toEqual({
        //   exOperation: 'registration',
        //   nextOperation: 'enrollment',
        //   item: '2',
        //   complete: 3,
        //   remaining: 1
        // });

        // Enrollment of user 2
        expect(this.requests.length).toEqual(4);
        expect(this.requests[3].url).toEqual('/api/v1/courses/1/enrollments');
        expect(this.requests[3].requestBody).toEqual(JSON.stringify({
          enrollment: {
            user_id: '2',
            type: K.USER_STUDENT_ENROLLMENT,
            enrollment_state: 'active',
            notify: false
          }
        }));

        this.respondTo(this.requests[3], 200, EnrollmentFixture);

        expect(onStatusChange).toHaveBeenCalled();
        // expect(Users.getProgressLog()).toEqual({
        //   exOperation: 'enrollment',
        //   nextOperation: undefined,
        //   item: '2',
        //   complete: 4,
        //   remaining: 0
        // });

        // Done
        expect(onError).not.toHaveBeenCalled();
        expect(onChange).toHaveBeenCalled();
      });
    });
  });
});