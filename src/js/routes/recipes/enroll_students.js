define(function(require) {
  var Route = require('routes/base');
  var K = require('constants');
  var Courses = require('stores/courses');
  var Users = require('stores/users');
  var View = require('jsx!views/recipes/enroll_students');

  new Route('enrollStudentsRecipe', {
    navLink: K.RECIPE_ENROLL_STUDENTS,
    views: [{ component: View }],

    model: function() {
      return Courses.fetch();
    },

    enter: function() {
      this.updateProps();

      Courses.addChangeListener(this.updateProps, this);
      Users.addChangeListener(this.updateProps, this);
      Users.addErrorListener(this.injectStoreError, this);
    },

    updateProps: function() {
      this.update({
        courses: Courses.getAll(),
        activeCourseId: Courses.getActiveCourseId()
      });
    }
  });
});