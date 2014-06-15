define(function(require) {
  var Pixy = require('ext/pixy');
  var K = require('constants');
  var Accounts = require('stores/accounts');
  var Courses = require('stores/courses');
  var Operation = require('models/operation');
  var BatchedOperation = require('models/batched_operation');
  var RSVP = require('rsvp');
  var ajax = require('core/ajax');
  var generateLogin = require('util/generate_login');
  var generateName = require('util/generate_name');

  var store, collection, operation;
  var status = K.STATUS_IDLE;

  var massEnrollment = new BatchedOperation({
    runner: function(context) {
      var studentId = ++context.guid + '';
      var accountId = context.accountId;
      var courseId = context.courseId;
      var prefix = context.prefix;
      var loginId = generateLogin(prefix, studentId);

      operation.mark('Signing up a student with a login id of "' + loginId + '".', studentId);
      context.status = setStatus(K.USER_REGISTERING)

      return signup(prefix, studentId, accountId).then(function(userId) {
        operation.mark('Enrolling student with user id [' + userId + ']', userId);
        context.status = setStatus(K.USER_ENROLLING)
        return enroll(userId, courseId);
      });
    },

    onDone: function(/*output, context*/) {
      store.emitChange();
      return true;
    },

    onError: function(error, context, resolve, reject) {
      var errorCode;

      console.warn('API operation failure:', error, error.stack);

      if (context.status === K.USER_REGISTERING) {
        errorCode = K.USER_REGISTRATION_FAILED;
      }
      else if (context.status === K.USER_ENROLLING) {
        errorCode = K.USER_ENROLLMENT_FAILED;
      }

      // TODO
      if (context.atomic === true) {
        reject(errorCode);
      }
      else {
        operation.mark(undefined, undefined, true);
        store.emitChange();
        resolve();
      }
    }
  });

  var trackCollection = function() {
    collection = Accounts.getUserCollection();
  };

  var setStatus = function(inStatus) {
    console.debug('> UserStore Status:', inStatus);

    status = inStatus;
    store.emitChange('status', inStatus);

    return inStatus;
  };

  /**
   * Loads all users from all accounts.
   */
  var loadAll = function(onChange) {
    var collections = Accounts.getAll().map(function(account) {
      return Accounts.getUserCollection(account.id);
    });

    var fetches = collections.map(function(collection) {
      return collection.fetch().then(function() {
        onChange();
        return store.getAll(collection);
      });
    });

    return RSVP.all(fetches);
  };

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

  var massEnroll = function(payload, onChange, onError) {
    var studentCount = parseInt(payload.studentCount || '', 10);
    var prefix = payload.prefix || K.DEFAULT_ID_PREFIX;
    var guid;

    if (!studentCount || studentCount < K.USER_MIN_ENROLL) {
      return onError(K.USER_ENROLLMENT_COUNT_TOO_LOW);
    }
    else if (studentCount && studentCount > K.USER_MAX_ENROLL) {
      return onError(K.USER_ENROLLMENT_COUNT_TOO_HIGH);
    }

    guid = parseInt(payload.idRange, 10) || 0;
    prefix = prefix.replace(/_+$/, '');

    operation = new Operation({
      count: studentCount * 2,
      itemCount: studentCount
    });

    setStatus(K.USER_MASS_ENROLLMENT_STARTED);

    massEnrollment.run(studentCount, {
      accountId: Accounts.getActiveAccountId(),
      courseId: Courses.getActiveCourseId(),
      prefix: prefix,
      guid: guid,
      operation: operation,
      atomic: payload.atomic
    }).then(function() {
      operation.mark();
      onChange();
    }, function(errorCode) {
      operation.abort(errorCode);
      onError(errorCode);
    }).then(function() {
      setStatus(K.STATUS_IDLE);
    });
  };

  store = new Pixy.Store('UserStore', {
    fetch: function() {
      return collection.fetch({ reset: true }).then(function() {
        return store.getAll(collection);
      });
    },

    getAll: function(collection) {
      return collection.invoke('toProps');
    },

    getStatus: function() {
      return status;
    },

    getCurrentOperation: function() {
      if (operation) {
        return operation.toProps();
      }
    },

    onAction: function(action, payload, onChange, onError) {
      switch(action) {
        case K.USER_LOAD_ALL:
          loadAll(onChange);
        break;

        case K.USER_MASS_ENROLL:
          massEnroll(payload, onChange, onError);
        break;
      }
    }
  });

  Accounts.on('change', trackCollection);

  trackCollection();

  return store;
});