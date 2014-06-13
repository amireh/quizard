define(function(require) {
  var Pixy = require('ext/pixy');
  var K = require('constants');
  var _ = require('underscore');
  var pluck = _.pluck;
  var where = _.where;
  var uniq = _.uniq;
  var extend = _.extend;
  var contains = _.contains;
  var uniqueId = _.uniqueId;
  var remove = _.remove;

  var extractBlanks = function(answers) {
    return uniq(pluck(answers, 'blank_id'));
  };

  var mkUnknownAnswer = function(id, attrs) {
    return extend({
      id: [ K.QUESTION_UNKNOWN_ANSWER, id ].join('_'),
      text: K.QUESTION_UNKNOWN_ANSWER_TEXT,
      unknown: true
    }, attrs);
  };

  var mkMissingAnswer = function(id, attrs) {
    return extend({
      id: [ K.QUESTION_MISSING_ANSWER, id ].join('_'),
      text: K.QUESTION_MISSING_ANSWER_TEXT,
      missing: true
    }, attrs);
  };

  var buildVariant = function() {
    return {
      id: uniqueId(),
      responseRatio: 0,
      remainingRespondents: 0,
      answerIds: []
    };
  };

  var QuizQuestion = Pixy.Model.extend({
    name: 'QuizQuestion',

    urlRoot: function() {
      return this.collection.url(true);
    },

    parse: function(payload) {
      var attrs = {};
      var id = ''+payload.id;
      var type = payload.question_type;
      var answers = payload.answers || [];
      var answerSets = [];

      // Wrap all answers in "answerSets" to normalize access between
      // question types that have multiple sets (like blanks) and those that
      // don't
      if (contains(K.QUESTIONS_WITH_ANSWER_SETS, type)) {
        answerSets = extractBlanks(answers).map(function(blankId) {
          return {
            id: blankId,
            answers: where(answers, { blank_id: blankId })
          };
        });
      } else {
        answerSets.push({
          id: 'auto',
          answers: answers
        });
      }

      // Generate answers for students who should skip the question, and those
      // who should answer randomly for free-form input questions
      if (contains(K.FREE_FORM_INPUT_QUESTIONS, type)) {
        answerSets.forEach(function(set) {
          set.answers.push(mkUnknownAnswer(id + '_' + set.id));
          set.answers.push(mkMissingAnswer(id + '_' + set.id));
        });
      }

      // Now we stringify ids and decorate answers
      answerSets.forEach(function(set) {
        var responseRatioDistributed = false;

        set.answers.forEach(function(answer) {
          answer.id = ''+answer.id;
          answer.correct = answer.weight === 100;
          answer.remainingRespondents = 0;
          answer.responseRatio = 0;

          if (answer.correct && !responseRatioDistributed) {
            responseRatioDistributed = true;
            answer.responseRatio = 100;
          }

          delete answer.weight;
        });
      });

      attrs.id = id;
      attrs.type = payload.question_type;
      attrs.text = payload.question_text;
      attrs.answerType = 'random';
      attrs.answerSets = answerSets;
      attrs.autoGradable = contains(K.MANUALLY_GRADED_QUESTIONS, type);
      attrs.pointsPossible = payload.points_possible;

      if (type === 'multiple_answers_question') {
        // Start out with a default empty variant
        attrs.variants = [ buildVariant() ];
        attrs.variants[0].responseRatio = 100;
      }

      return attrs;
    },

    toProps: function() {
      var props = this.pick([
        'id',
        'type',
        'text',
        'answerType',
        'answerSets',
        'variants',
        'position'
      ]);

      // which is basically everything.. duh

      return props;
    },

    addVariant: function() {
      this.get('variants').push(buildVariant());
    },

    removeVariant: function(variantId) {
      var variants = this.get('variants');

      if (variants.length === 1) {
        return false;
      }

      variants = remove(variants, { id: variantId });

      if (variants.length === 1) {
        variants[0].responseRatio = 100;
      }

      this.set('variants', variants);
    },

    getResponsePool: function() {
      if (this.get('type') === 'multiple_answers_question') {
        return this.get('variants');
      }
      else {
        return this.get('answerSets').reduce(function(answers, set) {
          return answers.concat(set.answers);
        }, []);
      }
    }
  });

  return QuizQuestion;
});