define([ 'core/dispatcher', 'constants' ], function(Dispatcher, K) {
  return {
    activate: function(id) {
      return Dispatcher.dispatch(K.QUIZ_ACTIVATE, {
        id: id
      });
    },

    loadMore: function() {
      return Dispatcher.dispatch(K.QUIZ_LOAD_MORE);
    }
  };
});