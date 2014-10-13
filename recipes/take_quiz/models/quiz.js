var Pixy = require('pixy');
var BaseQuiz = require('models/quiz');
var QuizQuestion = require('./quiz_question');
var Collection = Pixy.Collection;

var Quiz = BaseQuiz.extend({
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

    return BaseQuiz.prototype.initialize.apply(this, arguments);
  },


  toProps: function() {
    var props = BaseQuiz.prototype.toProps.call(this);

    props.questions = this.questions.toProps().filter(function(question) {
      return question.type !== 'text_only_question';
    });

    return props;
  }
})