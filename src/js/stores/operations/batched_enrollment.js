define(function(require) {
  var K = require('constants');
  var BatchedOperation = require('models/batched_operation');
  var generateLogin = require('util/generate_login');
  var generateName = require('util/generate_name');
  var ajax = require('core/ajax');

  var signup = function(prefix, id, accountId) {
    var loginId = generateLogin(prefix, id);

    return ajax({
      url: '/accounts/' + accountId + '/users',
      type: 'POST',
      data: JSON.stringify({
        user: {
          name: generateName(loginId),
        },
        pseudonym: {
          unique_id: [ loginId, K.STUDENT_EMAIL_DOMAIN ].join('@'),
          password: K.STUDENT_PASSWORD,
          send_confirmation: false
        }
      })
    }).then(function(user) {
      return user.id;
    });
  };

  var enroll = function(userId, courseId) {
    return ajax({
      url: '/courses/' + courseId + '/enrollments',
      type: 'POST',
      data: JSON.stringify({
        enrollment: {
          user_id: ''+userId,
          type: K.USER_STUDENT_ENROLLMENT,
          enrollment_state: 'active',
          notify: false
        }
      })
    });
  };

  /**
   * Register a user then enroll them into a course as a student.
   *
   * @param {Object} context
   *
   * @param {Number} context.guid
   *        Starting id prefix to use for generating logins.
   *
   * @param {Number} context.accountId
   *
   * @param {Number} context.courseId
   *
   * @param {String} context.prefix
   *
   * @param {Function} context.emitChange
   *        Binding to the store's #emitChange() which will be called each
   *        time a student is signed up and enrolled successfully.
   *
   * @param {OperationStatus} context.operation
   *
   * @param {Boolean} [atomic=false]
   *        Pass as true if you want to abort as soon as any
   *        registration/enrollment fails.
   *
   * The operation will be marked with the following actions that you can track:
   *
   *  - USER_REGISTERING
   *  - USER_ENROLLING
   *
   */
  return new BatchedOperation({
    runner: function(context) {
      var studentId = ++context.guid + '';
      var accountId = context.accountId;
      var courseId = context.courseId;
      var prefix = context.prefix;
      var loginId = generateLogin(prefix, studentId);

      context.operation.mark(K.USER_REGISTERING, { login: loginId });

      return signup(prefix, studentId, accountId).then(function(userId) {
        context.operation.mark(K.USER_ENROLLING, {
          userId: userId
        });

        return enroll(userId, courseId);
      });
    },

    onDone: function(output, context) {
      context.emitChange();
      context.operation.mark();
      return true;
    },

    onError: function(error, context, resolve, reject) {
      if (context.atomic === true) {
        reject(context.operation.action);
      }
      else {
        context.operation.markActionFailed();
        resolve();
      }
    }
  });
});