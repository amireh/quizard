define(function(require) {
  var Route = require('routes/base');
  var K = require('constants');
  var RSVP = require('rsvp');
  var Accounts = require('stores/accounts');
  var Courses = require('stores/courses');
  var Users = require('stores/users');

  new Route('enrollStudentsRecipe', {
    navLink: K.RECIPE_ENROLL_STUDENTS,

    model: function() {
      return RSVP.all([
        Accounts.fetch(),
        Courses.fetch()
      ]);
    },

    enter: function() {
      this.updateProps();

      Accounts.addChangeListener(this.updateProps, this);
      Courses.addChangeListener(this.updateProps, this);
      Users.addChangeListener(this.updateProps, this);
      Users.addErrorListener(this.injectStoreError, this);
    },

    updateProps: function() {
      this.update({
        accounts: Accounts.getAll(),
        activeAccountId: Accounts.getActiveAccountId(),
        courses: Courses.getAll(),
        activeCourseId: Courses.getActiveCourseId(),
        userStatus: Users.getStatus(),
        enrollment: Users.getCurrentOperation()
      });
    }
  });
});