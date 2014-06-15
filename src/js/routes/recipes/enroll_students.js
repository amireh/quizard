define(function(require) {
  var Route = require('routes/base');
  var K = require('constants');
  var Courses = require('stores/courses');
  var Users = require('stores/users');

  new Route('enrollStudentsRecipe', {
    navLink: K.RECIPE_ENROLL_STUDENTS,

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
        activeCourseId: Courses.getActiveCourseId(),
        userStatus: Users.getStatus(),
        enrollment: Users.getCurrentOperation()
      });
    }
  });
});