define(function(require) {
  var Pixy = require('ext/pixy');
  var K = require('constants');
  var Accounts = require('stores/accounts');
  var Courses = require('stores/courses');
  var RSVP = require('rsvp');
  var ajax = require('core/ajax');

  var store;
  var collection;
  var progressLog = {};
  var status = { code: K.STATUS_IDLE };

  var trackCollection = function() {
    collection = Accounts.getUserCollection();
  };

  var setStatus = function(inStatus) {
    console.debug('> UserStore Status:', inStatus.code, inStatus.message);

    status = inStatus;
    store.emitChange('status', inStatus);
  };

  var genUserId = function(prefix, id) {
    return [ prefix, id ].join('_');
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

  var signup = function(prefix, id, collection) {
    var name = genUserId(prefix, id);
    var password = [ prefix, id, 'password' ].join('_');
    var email = name + '@quizard.com';

    var user = collection.push({});

    setStatus({
      code: K.USER_REGISTERING,
      message: 'Signing up a student with a login id of "' + name + '".'
    });

    return user.save({
      user: {
        name: name,
      },
      pseudonym: {
        unique_id: email,
        password: password,
        send_confirmation: false
      }
    }, { wait: true, parse: true, validate: false });
  };

  var enroll = function(id, courseId) {
    setStatus({
      code: K.USER_ENROLLING,
      message: 'Enrolling user ' + id + ' into course#' + courseId + '.'
    });

    return ajax({
      url: '/courses/' + courseId + '/enrollments',
      type: 'POST',
      data: JSON.stringify({
        enrollment: {
          user_id: ''+id,
          type: K.USER_STUDENT_ENROLLMENT,
          enrollment_state: 'active',
          notify: false
        }
      })
    });
  };

  var massEnroll = function(payload, onChange, onError) {
    var loginId, userId;
    var studentCount = parseInt(payload.studentCount || '', 10);
    var courseId = Courses.getActiveCourseId();
    var prefix = payload.prefix || K.DEFAULT_ID_PREFIX;
    var emitProgress = function(attrs) {
      progressLog = attrs;
      store.trigger('change:progressLog');
    };
    var guid = 0;

    if (!studentCount || studentCount < K.USER_MIN_ENROLL) {
      return onError('You must want to enroll at least one student.');
    }
    else if (studentCount && studentCount > K.USER_MAX_ENROLL) {
      return onError("You can enroll as many as " + K.USER_MAX_ENROLL + " students, no more.");
    }

    guid = parseInt(payload.idRange, 10) || guid;
    prefix = prefix.replace(/_+$/, '');

    console.debug("I'll be enrolling", studentCount, "students within the course", courseId);

    setStatus({
      code: K.STATUS_BUSY,
      message: 'Preparing to register and enroll ' + studentCount + ' students.'
    });

    var studentIndex;
    var fireStarter = RSVP.defer();
    var operationCount = studentCount * 2;
    var operationIndex = 0;
    var lastPromise = fireStarter.promise;

    for (studentIndex = 0; studentIndex < studentCount; ++studentIndex) {

      lastPromise = lastPromise.then(function() {
        loginId = ++guid + '';
        console.debug('Operating as', loginId);
        console.debug('\tSigning up as', loginId);
        return signup(prefix, loginId, Accounts.getUserCollection());
      }).then(function(user) {
        userId = user.get('id');

        console.debug('\t\tEnrolling', userId, 'as', genUserId(prefix, loginId));

        emitProgress({
          exOperation: 'registration',
          nextOperation: 'enrollment',
          item: loginId,
          complete: ++operationIndex,
          remaining: operationCount - operationIndex
        });

        return enroll(userId, courseId)
      }).then(function() {
        var remaining = operationCount - (++operationIndex);

        console.debug('\t\t\tEnrollment of', genUserId(prefix, loginId), 'was successful.');

        emitProgress({
          exOperation: 'enrollment',
          nextOperation: (remaining === 0) ? undefined : 'registration',
          item: loginId,
          complete: operationIndex,
          remaining: remaining
        });

        return true;
      });
    }

    lastPromise.then(function() {
      setStatus({
        code: K.STATUS_IDLE,
        message: 'All ' + studentCount + ' students have been enrolled.'
      });

      onChange();
    }).catch(function(apiError) {
      var errorCode;
      var errorMessage;
      var userId = genUserId(prefix, loginId);

      apiError = apiError || {};

      console.warn('API operation failure:', apiError, apiError.stack);

      if (status.code === K.USER_REGISTERING) {
        errorCode = K.USER_REGISTRATION_FAILED;

        if (apiError.status === 400) {
          errorMessage = [
            'Unable to register user with login "' + userId + "'.",
            'This probably means you have already registered a similar user by' +
            'Quizard. Try using a higher ID Range or a different ID Prefix.'
          ].join(' ');
        } else {
          errorMessage = [
            'Unable to register user with login "' + userId + "'.",
            'Something went wrong internally.'
          ].join(' ');
        }
      }
      else if (status.code === K.USER_ENROLLING) {
        errorCode = K.USER_ENROLLMENT_FAILED;

        if (apiError.status === 400) {
          errorMessage = [
            'Unable to enroll user with login "' + userId + "'.",
            'This probably means you have already registered a similar user by' +
            'Quizard. Try using a higher ID Range or a different ID Prefix.'
          ].join(' ');
        } else {
          errorMessage = [
            'Unable to enroll user with login "' + userId + "'.",
            'Something went wrong internally.'
          ].join(' ');
        }
      }

      onError(errorCode);

      setStatus({
        code: errorCode,
        message: errorMessage
      });
    });

    // get cooking
    fireStarter.resolve();
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

    getProgressLog: function() {
      return progressLog;
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