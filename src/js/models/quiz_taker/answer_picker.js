define(function(require) {
  var contains = require('underscore').contains;
  var MultipleChoiceLike = [
    'multiple_choice_question',
    'true_false_question'
  ];

  return function pickAnswer(question) {
    var answerSets = question.get('answerSets');
    var questionType = question.get('type');
    var answerSet;
    var answer;
    var value;

    if (contains(MultipleChoiceLike, questionType)) {
      answerSet = answerSets[0];
      answer = question.getNextAnswer(answerSet);

      answer.remainingRespondents -= 1;
      return answer.id;
    }
    else if (questionType === 'short_answer_question') {
      answerSet = answerSets[0];
      answer = question.getNextAnswer(answerSet);

      if (answer.id.substr(0,4) === 'none') {
        return '';
      }
      else if (answer.id.substr(0,5) === 'other') {
        return 'some really random answer';
      }
      else {
        return answer.text;
      }
    }
    else if (questionType === 'fill_in_multiple_blanks_question') {
      value = answerSets.reduce(function(blanks, answerSet) {
        answer = question.getNextAnswer(answerSet);

        blanks[answerSet.id] = answer.text;

        return blanks;
      }, {});
    }
    else if (questionType === 'multiple_dropdowns_question') {
      value = answerSets.reduce(function(variables, answerSet) {
        answer = question.getNextAnswer(answerSet);

        variables[answerSet.id] = answer.id;

        return variables;
      }, {});
    }
    else if (questionType === 'multiple_answers_question') {
      // TODO
    }

    return value;
  }
});