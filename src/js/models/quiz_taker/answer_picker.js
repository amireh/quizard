define(function(require) {
  var _ = require('underscore');
  var K = require('constants');
  var generateRandomString = require('util/generate_random_string');
  var contains = _.contains;
  var find = _.find;
  var MultipleChoiceLike = [
    'multiple_choice_question',
    'true_false_question'
  ];
  var ShortAnswerLike = [
    'short_answer_question',
    'essay_question'
  ];

  var pullAndMarkAnswer = function(answers) {
    return find(answers, function(answer) {
      var remaining = answer.remainingRespondents;

      if (remaining > 0) {
        answer.remainingRespondents -= 1;
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

      return answer.id;
    }
    else if (contains(ShortAnswerLike, questionType)) {
      answerSet = answerSets[0];
      answer = pullAndMarkAnswer(answerSet.answers);

      value = answer.text;
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

    // If the student has chosen an unknown answer, we want it to be something
    // random too:
    if (value === K.QUESTION_UNKNOWN_ANSWER_TEXT) {
      value = generateRandomString();
    }
    else if (value === K.QUESTION_MISSING_ANSWER_TEXT) {
      value = '';
    }

    return value;
  };
});