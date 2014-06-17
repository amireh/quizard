define(function(require) {
  var Route = require('routes/base');
  var K = require('constants');
  var Users = require('stores/users');
  var Accounts = require('stores/accounts');
  var View = require('jsx!views/recipes/load_students');

  new Route('loadStudentsRecipe', {
    navLink: K.RECIPE_LOAD_STUDENTS,
    views: [{ component: View }],
    accessPolicy: 'private',

    enter: function() {
      this.updateProps();

      Accounts.addChangeListener(this.updateProps, this);
      Users.addChangeListener(this.updateProps, this);
      Users.addErrorListener(this.injectStoreError, this);
    },

    updateProps: function() {
      this.update({
        studentLoading: Users.getStudentLoadingOperation(),
        studentStats: Users.getStudentStats()
      });
    }
  });
});