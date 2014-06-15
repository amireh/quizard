define(function(require) {
  var _ = require('underscore');
  var contains = _.contains;
  var find = _.find;
  var MultipleChoiceLike = [
    'multiple_choice_question',
    'true_false_question'
  ];

  var pullAndMarkAnswer = function(answers) {
    return find(answers, function(answer) {
      var remaining = answer.remainingRespondents;

      if (remaining > 0) {
        answer.remainingRespondents -= 1;
        console.debug('Pulled answer out of pool:', answer, answer.remainingRespondents);
        return true;
      }
    });
  };

  return function pickAnswer(question) {
    var answerSets = question.get('answerSets');
    var variants = question.get('variants');
    var questionType = question.get('type');
    var answerSet;
    var answer;
    var value;
    var variant;

    if (contains(MultipleChoiceLike, questionType)) {
      answerSet = answerSets[0];
      answer = pullAndMarkAnswer(answerSet.answers);

      if (!answer) {
        debugger
      }

      return answer.id;
    }
    else if (questionType === 'short_answer_question') {
      answerSet = answerSets[0];
      answer = pullAndMarkAnswer(answerSet.answers);

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
        var text;

        answer = pullAndMarkAnswer(answerSet.answers);

        // kuz if we want the student not to answer this blank, we leave it
        // empty
        if (answer && !answer.missing) {
          text = answer.text;
        }

        blanks[answerSet.id] = text;

        return blanks;
      }, {});
    }
    else if (questionType === 'multiple_dropdowns_question') {
      value = answerSets.reduce(function(variables, answerSet) {
        answer = pullAndMarkAnswer(answerSet.answers);

        variables[answerSet.id] = answer.id;

        return variables;
      }, {});
    }
    else if (questionType === 'multiple_answers_question') {
      variant = pullAndMarkAnswer(variants);

      if (variant) {
        value = variant.answerIds;
      }
    }

    return value;
  }
});