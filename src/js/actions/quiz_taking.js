define([ 'core/dispatcher', 'constants' ],
function(Dispatcher, K) {
  return {
    set: function(attrs) {
      return Dispatcher.dispatch(K.QUIZ_TAKING_SET, attrs).index;
    },

    /**
     *
     * @param {String} answerId
     * @param {Number} ratio
     *
     * @param {Object} [options={}]
     * @param {Boolean} options.variant
     *        Pass as true if this is a response ratio for a Multiple-Answers
     *        question variant.
     */
    setResponseRatio: function(questionId, answerId, ratio, options) {
      return Dispatcher.dispatch(K.QUIZ_TAKING_SET_RESPONSE_RATIO, {
        questionId: questionId,
        answerId: answerId,
        ratio: ratio,
        options: options
      }).index;
    },

    setResponseCount: function(count) {
      return Dispatcher.dispatch(K.QUIZ_TAKING_SET_RESPONSE_COUNT, {
        count: count
      }).index;
    },

    randomizeRatios: function() {
      return Dispatcher.dispatch(K.QUIZ_TAKING_RANDOMIZE_RESPONSE_RATIOS).index;
    },

    take: function(atomic) {
      return Dispatcher.dispatch(K.QUIZ_TAKING_TAKE, {
        atomic: atomic
      }).index;
    },

    addAnswer: function(questionId) {
      return Dispatcher.dispatch(K.QUIZ_TAKING_ADD_ANSWER, {
        questionId: questionId
      }).index;
    },

    addAnswerToVariant: function(questionId, variantId, answerId) {
      return Dispatcher.dispatch(K.QUIZ_TAKING_ADD_ANSWER_TO_VARIANT, {
        questionId: questionId,
        variantId: variantId,
        answerId: answerId
      }).index;
    },

    addVariant: function(questionId) {
      return Dispatcher.dispatch(K.QUIZ_TAKING_ADD_VARIANT, {
        questionId: questionId
      }).index;
    },

    removeVariant: function(questionId, variantId) {
      return Dispatcher.dispatch(K.QUIZ_TAKING_REMOVE_VARIANT, {
        questionId: questionId,
        variantId: variantId
      }).index;
    },

    loadStudents: function() {

    }
  };
});