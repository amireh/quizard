define(function(require) {
  var Pixy = require('pixy');
  var QuizQuestion = require('./quiz_question');
  var Model = Pixy.Model;
  var Collection = Pixy.Collection;

  /**
   * @class Models.Quiz
   *
   * The Admin or one of them students.
   */
  return Model.extend({
    name: 'Quiz',

    urlRoot: function() {
      return this.collection.url(true);
    },

    initialize: function() {
      var quiz = this;

      this.questions = new Collection([], {
        comparator: function(model) {
          return model.get('position');
        },

        url: function() {
          return quiz.url() + '/questions?page=' + (this.meta.currentPage || 1);
        },

        model: QuizQuestion
      });
    },

    parse: function(payload) {
      if (payload.title) {
        payload.name = payload.title;
        delete payload.title;
      }

      return payload;
    },

    toProps: function() {
      var props = {};

      props.id = this.get('id') + '';
      props.name = this.get('name');
      props.questions = this.questions.toProps().filter(function(question) {
        return question.type !== 'text_only_question';
      });

      props.url = this.url();

      return props;
    }
  });
});