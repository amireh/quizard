define(function(require) {
  var Pixy = require('ext/pixy');
  var K = require('constants');
  var Accounts = require('stores/accounts');
  var Courses = require('stores/courses');
  var Operation = require('models/operation');
  var OperationStore = require('./operations');
  var batchedEnrollment = require('./operations/batched_enrollment');
  // var RSVP = require('rsvp');

  var loadUsers = require('./operations/batched_load_users');

  // var store, operation;
  var store, emitChange;
  var status = K.STATUS_IDLE;

  var getCollection = function() {
    return Accounts.getUserCollection();
  };

  var setStatus = function(inStatus) {
    console.debug('> UserStore Status:', inStatus);

    status = inStatus;
    emitChange('status', inStatus);

    return inStatus;
  };

  /**
   * Loads all users in the active account.
   */
  var load = function(options, onChange, onError) {
    var collection = getCollection();
    var count, runnerCount;

    if (!collection) {
      return onError(K.ERROR_ACCOUNT_REQUIRED);
    }

    count = parseFloat(options.count);

    if (!count || count < 0) {
      return onError(K.USER_BAD_STUDENT_COUNT);
    }

    runnerCount = Math.ceil(count / K.USER_MAX_PER_PAGE, 10);

    var operation = new Operation({
      count: runnerCount,
      itemCount: runnerCount
    });

    setStatus(K.USER_LOADING);

    loadUsers.run(runnerCount, {
      page: options.page,
      reset: options.reset,
      collection: collection,
      operation: operation,
      emitChange: emitChange,
    }).then(function() {

      onChange();
    }, function() {
      onError();
    }).then(function() {
      setStatus(K.STATUS_IDLE);
    });
  };

  var enroll = function(payload, onChange, onError) {
    var studentCount = parseInt(payload.studentCount || '', 10);
    var prefix = payload.prefix || K.DEFAULT_ID_PREFIX;
    var guid, operation, descriptor;

    if (!studentCount || studentCount < K.USER_MIN_ENROLL) {
      return onError(K.USER_ENROLLMENT_COUNT_TOO_LOW);
    }
    else if (studentCount && studentCount > K.USER_MAX_ENROLL) {
      return onError(K.USER_ENROLLMENT_COUNT_TOO_HIGH);
    }

    guid = parseInt(payload.idRange, 10) || 0;
    prefix = prefix.replace(/_+$/, '');

    operation = OperationStore.start('enrollment', {
      count: studentCount * 2,
      itemCount: studentCount
    });

    descriptor = batchedEnrollment.run(studentCount, {
      accountId: Accounts.getActiveAccountId(),
      courseId: Courses.getActiveCourseId(),
      prefix: prefix,
      guid: guid,
      operation: operation,
      atomic: payload.atomic,
      emitChange: emitChange
    })

    descriptor.then(function() {
      operation.markComplete();
      onChange();
    }).catch(function(rc) {
      if (rc.code === K.OPERATION_ABORTED) {
        operation.markAborted();
      } else {
        operation.markFailed(rc.detail);
      }

      onError();
    });

    operation.on('abort', descriptor.abort);
  };

  store = new Pixy.Store('UserStore', {
    initialize: function() {
      // cache it
      emitChange = this.emitChange.bind(this);
    },

    getAll: function() {
      var collection = getCollection();
      return collection ? collection.invoke('toProps') : [];
    },

    getStatus: function() {
      return status;
    },

    getCurrentOperation: function() {
      // if (operation) {
      //   return operation.toProps();
      // }
    },

    getStudentCount: function() {
      var collection = getCollection();
      return collection ? collection.length : 0;
    },

    getStudentStats: function() {
      var collection = getCollection();

      if (collection) {
        return {
          cached: collection.meta.cached,
          hasMore: collection.meta.hasMore,
          availableCount: collection.length,
          estimatedCount: collection.meta.totalCount || 0,
          remainder: collection.meta.remainder,
        };
      }
    },

    onAction: function(action, payload, onChange, onError) {
      switch(action) {
        case K.USER_LOAD:
          load(payload, onChange, onError);
        break;

        case K.USER_MASS_ENROLL:
          enroll(payload, onChange, onError);
        break;
      }
    }
  });

  return store;
});