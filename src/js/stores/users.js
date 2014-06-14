define(function(require) {
  var Pixy = require('ext/pixy');
  var K = require('constants');
  var Accounts = require('stores/accounts');
  var Courses = require('stores/courses');
  var Operation = require('models/operation');
  var RSVP = require('rsvp');
  var ajax = require('core/ajax');
  var generateLogin = require('util/generate_login');
  var generateName = require('util/generate_name');

  var store;
  var collection;
  var operation;
  var status = { code: K.STATUS_IDLE };

  var trackCollection = function() {
    collection = Accounts.getUserCollection();
  };

  var setStatus = function(inStatus) {
    console.debug('> UserStore Status:', inStatus.code, inStatus.message);

    status = inStatus;
    store.emitChange('status', inStatus);
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
    var loginId = generateLogin(prefix, id);
    var password = K.STUDENT_PASSWORD;
    var email = [ loginId, K.STUDENT_EMAIL_DOMAIN ].join('@');
    var message = 'Signing up a student with a login id of "' + loginId + '".';
    var user = collection.push({});

    setStatus({
      code: K.USER_REGISTERING,
      message: message
    });

    operation.mark(message, loginId);

    return user.save({
      user: {
        name: generateName(loginId),
      },
      pseudonym: {
        unique_id: email,
        password: password,
        send_confirmation: false
      }
    }, { wait: true, parse: true, validate: false });
  };

  var enroll = function(userId, courseId) {
    var message = 'Enrolling student with user id [' + userId + ']';

    setStatus({ code: K.USER_ENROLLING, message: message });
    operation.mark(message, userId);

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
    var loginId;
    var studentCount = parseInt(payload.studentCount || '', 10);
    var courseId = Courses.getActiveCourseId();
    var prefix = payload.prefix || K.DEFAULT_ID_PREFIX;
    var guid = 0;

    if (!studentCount || studentCount < K.USER_MIN_ENROLL) {
      return onError(K.USER_ENROLLMENT_COUNT_TOO_LOW);
    }
    else if (studentCount && studentCount > K.USER_MAX_ENROLL) {
      return onError(K.USER_ENROLLMENT_COUNT_TOO_HIGH);
    }

    guid = parseInt(payload.idRange, 10) || guid;
    prefix = prefix.replace(/_+$/, '');

    store.trigger(K.USER_MASS_ENROLLMENT_STARTED);

    setStatus({
      code: K.STATUS_BUSY,
      message: 'Preparing to register and enroll ' + studentCount + ' students.'
    });

    var studentIndex;
    var fireStarter = RSVP.defer();
    // var operationCount = studentCount * 2;
    // var operationIndex = 0;
    var lastPromise = fireStarter.promise;

    operation = new Operation({
      count: studentCount * 2,
      itemCount: studentCount
    });
    operation.on('change', this.emitChange, this);

    for (studentIndex = 0; studentIndex < studentCount; ++studentIndex) {
      lastPromise = lastPromise.then(function() {
        loginId = ++guid + '';
        console.debug('Operating as', loginId);
        console.debug('\tSigning up as', loginId);


        return signup(prefix, loginId, Accounts.getUserCollection());
      }).then(function(user) {
        return enroll(user.get('id'), courseId);
      }).then(function() {
        console.debug('\t\t\tEnrollment of', generateLogin(prefix, loginId), 'was successful.');
        store.emitChange();
        return true;
      });
    }

    lastPromise.then(function() {
      status = {
        code: K.STATUS_IDLE,
        message: 'All ' + studentCount + ' students have been enrolled.'
      };

      operation.mark();

      onChange();
    }).catch(function(apiError) {
      var errorCode;
      var errorMessage;
      var userId = generateLogin(prefix, loginId);

      apiError = apiError || {};

      console.warn('API operation failure:', apiError, apiError.stack);

      if (status.code === K.USER_REGISTERING) {
        errorCode = K.USER_REGISTRATION_FAILED;
      }
      else if (status.code === K.USER_ENROLLING) {
        errorCode = K.USER_ENROLLMENT_FAILED;
      }

      onError(errorCode);

      setStatus({
        code: errorCode,
        message: errorMessage
      });

      operation.abort(errorCode);
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