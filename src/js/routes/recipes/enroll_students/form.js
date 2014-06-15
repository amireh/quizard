define(function(require) {
  var Route = require('routes/base');
  var View = require('jsx!views/users/enroll');
  var Users = require('stores/users');
  var K = require('constants');

  return new Route('enrollStudentsForm', {
    views: [{ component: View }],

    events: {
      willTransition: function(transition) {
        if (transition.targetName === 'enrollStudentsProgress') {
          this.progressShown = true;
        }
      }
    },

    enter: function() {
      this.progressShown = false;
      this.listenTo(Users, 'change:status', this.showProgress);
    },

    showProgress: function(status) {
      if (status === K.USER_MASS_ENROLLMENT_STARTED) {
        console.info('UserStore is busy, redirecting to progress dialog.');
        this.transitionTo(K.RECIPE_ENROLL_STUDENTS_PROGRESS);
      }
    },

    shouldUnmount: function() {
      return !this.progressShown;
    }
  });
});