define([ 'core/dispatcher', 'constants' ],
function(Dispatcher, K) {
  return {
    minimize: function() {
      return Dispatcher.dispatch(K.OPERATION_BOX_MINIMIZE);
    },

    restore: function() {
      return Dispatcher.dispatch(K.OPERATION_BOX_RESTORE);
    },

    abort: function(operationId) {
      return Dispatcher.dispatch(K.OPERATION_ABORT, {
        operationId: operationId
      });
    }
  };
});