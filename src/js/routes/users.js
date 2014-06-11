define([
  'routes/base',
  'rsvp',
  'stores/accounts',
  'stores/users',
  'stores/courses',
], function(Route, RSVP, AccountStore, UserStore, CourseStore) {
  new Route('users', {
    enter: function() {
      this.listenTo(UserStore, 'actionError', function(action, index, error) {
        this.injectStoreError(index, error);
      });
    }
  });
});