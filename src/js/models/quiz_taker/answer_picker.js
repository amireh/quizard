define(function(require) {
  var contains = require('underscore').contains;
  var MultipleChoiceLike = [
    'multiple_choice_question',
    'true_false_question'
  ];

  return function pickAnswer(questionType, answer) {
    if (contains(MultipleChoiceLike, questionType)) {
      return answer.id;
    }
    else if (questionType === 'short_answer_question') {
      if (answer.id === 'none') {
        return '';
      }
      else if (answer.id === 'other') {
        return 'some really random answer';
      }
      else {
        return answer.text;
      }
    }
  };
});