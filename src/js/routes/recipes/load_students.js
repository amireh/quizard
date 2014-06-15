define(function(require) {
  var Route = require('routes/base');
  var K = require('constants');
  var Users = require('stores/users');
  var View = require('jsx!views/recipes/load_students');

  new Route('loadStudentsRecipe', {
    navLink: K.RECIPE_LOAD_STUDENTS,
    views: [{ component: View }],

    enter: function() {
      this.updateProps();

      Users.addChangeListener(this.updateProps, this);
    },

    updateProps: function() {
      this.update({
        userStatus: Users.getStatus(),
        studentLoading: Users.getCurrentOperation(),
        studentStats: Users.getStudentStats()
      });
    }
  });
});