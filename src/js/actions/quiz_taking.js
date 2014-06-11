define([ 'core/dispatcher', 'constants' ],
function(Dispatcher, K) {
  return {
    set: function(attrs) {
      return Dispatcher.dispatch(K.QUIZ_TAKING_SET, attrs);
    }
  };
});