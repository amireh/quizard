define(function(require) {
  var _ = require('ext/underscore');
  var findBy = _.findBy;
  var pluck = _.pluck;
  var find = _.find;

  return function findAnswerSet(answerId, questions, answerSetId) {
    var locator = { id: answerId };
    var answerSet;
    questions.each(function(question) {
      if (answerSet) {
        return;
      }
      else if (answerSetId) {
        answerSet = findBy(question.get('answerSets'), { id: answerSetId });
      }
      else {
        answerSet = find(question.get('answerSets'), function(_answerSet) {
          return findBy(_answerSet.answers, locator);
        });
      }
    });

    return answerSet;
  };
});