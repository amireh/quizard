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

    loadAll: function() {
      return Dispatcher.dispatch(K.USER_LOAD_ALL);
    }
  };
});