define([ 'core/dispatcher', 'constants' ],
function(Dispatcher, K) {
  return {
    set: function(attrs) {
      return Dispatcher.dispatch(K.QUIZ_TAKING_SET, attrs).index;
    },

    take: function() {
      return Dispatcher.dispatch(K.QUIZ_TAKING_TAKE).index;
    },

    addAnswer: function(questionId) {
      return Dispatcher.dispatch(K.QUIZ_TAKING_ADD_ANSWER, {
        questionId: questionId
      }).index;
    }
  };
});