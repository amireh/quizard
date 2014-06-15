define(function(require) {
  var Route = require('routes/base');
  var K = require('constants');
  var RSVP = require('rsvp');
  var Accounts = require('stores/accounts');
  var Users = require('stores/users');
  var View = require('jsx!views/recipes/load_students');

  new Route('loadStudentsRecipe', {
    navLink: K.RECIPE_LOAD_STUDENTS,
    views: [{ component: View }],

    model: function() {
      return Accounts.fetch();
    },

    enter: function() {
      this.updateProps();

      Accounts.addChangeListener(this.updateProps, this);
      Users.addChangeListener(this.updateProps, this);
    },

    updateProps: function() {
      this.update({
        accounts: Accounts.getAll(),
        activeAccountId: Accounts.getActiveAccountId(),
        userStatus: Users.getStatus(),
        studentLoading: Users.getCurrentOperation(),
        studentStats: Users.getStudentStats()
      });
    }
  });
});