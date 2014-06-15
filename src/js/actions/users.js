define([ 'core/dispatcher', 'constants' ],
function(Dispatcher, K) {
  return {
    create: function(name, email, password) {
      return Dispatcher.dispatch(K.USER_CREATE, {
        name: name,
        email: email,
        password: password
      });
    },

    load: function(count, reset) {
      return Dispatcher.dispatch(K.USER_LOAD, {
        count: count,
        reset: reset
      });
    },

    massEnroll: function(studentCount, prefix, idRange, isAtomic) {
      return Dispatcher.dispatch(K.USER_MASS_ENROLL, {
        studentCount: studentCount,
        prefix: prefix,
        idRange: idRange,
        atomic: isAtomic
      }).index;
    }
  };
});