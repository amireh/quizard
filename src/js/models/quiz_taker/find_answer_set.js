define(function(require) {
  var _ = require('ext/underscore');
  var findBy = _.findBy;
  var pluck = _.pluck;
  var find = _.find;

  return function findAnswerSet(answerId, questions) {
    var locator = { id: answerId };
    var answerSet;

    questions.each(function(question) {
      if (!answerSet) {
        answerSet = find(question.get('answerSets'), function(_answerSet) {
          console.debug('Looking for', answerId, 'in', pluck(_answerSet.answers, 'id'));
          return findBy(_answerSet.answers, locator);
        });
      }
    });

    return answerSet;
  };
});