define([ 'core/dispatcher', 'constants' ],
function(Dispatcher, K) {
  return {
    abort: function(operationId) {
      return Dispatcher.dispatch(K.OPERATION_ABORT, {
        operationId: operationId
      });
    }
  };
});