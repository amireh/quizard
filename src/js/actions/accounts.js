define([ 'core/dispatcher', 'constants' ],
function(Dispatcher, K) {
  return {
    activate: function(id) {
      return Dispatcher.dispatch(K.ACCOUNT_ACTIVATE, {
        id: id
      });
    }
  };
});