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
        url: function() {
          return quiz.url() + '/questions';
        },
        model: QuizQuestion
      });
    },

    toProps: function() {
      var props = {};

      props.id = this.get('id') + '';
      props.name = this.get('title');

      return props;
    }
  });
});