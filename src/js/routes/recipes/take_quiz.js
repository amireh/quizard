define(function(require) {
  var Route = require('routes/base');
  var View = require('jsx!views/recipes/take_quiz');
  var CourseStore = require('stores/courses');
  var QuizStore = require('stores/quizzes');
  var RouteStore = require('stores/routes');
  var K = require('constants');

  new Route('takeQuizRecipe', {
    views: [{ component: View, into: 'dialogs' }],
    navLink: K.RECIPE_TAKE_QUIZ,

    model: function() {
      return CourseStore.fetch();
    },

    enter: function() {
      CourseStore.addChangeListener(this.updateProps, this);
      QuizStore.addChangeListener(this.updateProps, this);
      RouteStore.addActionErrorListener(K.ROUTE_GO_TO_QUIZ, this.injectStoreError, this);

      this.updateProps();
    },

    updateProps: function() {
      this.update({
        activeCourseId: CourseStore.getActiveItemId(),
        courses: CourseStore.getAll()
      });
    }
  });
});