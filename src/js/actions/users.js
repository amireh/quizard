define([ 'core/dispatcher', 'constants' ],
function(Dispatcher, K) {
  return {
    create: function(name) {
      return Dispatcher.dispatch(K.USER_CREATE);
    },

    loadAll: function() {
      return Dispatcher.dispatch(K.USER_LOAD_ALL);
    }
  };
});