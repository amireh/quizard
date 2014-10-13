var Route = require('routes/base');
var CourseStore = require('stores/courses');
var Quiz = require('../models/quiz');
var QuizStore = require('stores/quizzes');
var K = require('constants');


module.exports = new Route('takeQuizRecipe', {
  navLink: K.RECIPE_TAKE_QUIZ,

  beforeModel: function() {
    QuizStore.collection.changeModel(Quiz);
  },

  model: function() {
    return CourseStore.fetch();
  },

  enter: function() {

    CourseStore.addChangeListener(this.updateProps, this);
    QuizStore.addChangeListener(this.updateProps, this);

    this.updateProps();
  },

  exit: function() {
    QuizStore.collection.restoreModel();
  },

  updateProps: function() {
    this.update({
      activeCourseId: CourseStore.getActiveItemId(),
      courses: CourseStore.getAll()
    });
  }
});