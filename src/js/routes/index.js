define([
  'routes/base',
  'jsx!views/index',
  'rsvp',
  'stores/sessions',
  'stores/accounts',
  'stores/courses'
], function(Route, View, RSVP, SessionStore, AccountStore, CourseStore) {
  new Route('index', {
    views: [{ component: View }],
    navLink: '/',

    model: function() {
      // this.setStatus('Loading accounts...');

      // return RSVP.all([
      //   AccountStore.fetch(),
      //   CourseStore.fetch()
      // ]);
    },

    enter: function() {
      // this.clearStatus();

      // this.listenTo(AccountStore, 'change', this.updateProps);
      // this.listenTo(CourseStore, 'change', this.updateProps);

      // this.updateProps();
    },

    exit: function() {
    },

    updateProps: function() {
      // var props = {};

      // props.user = SessionStore.get();
      // props.accounts = AccountStore.getAll();
      // props.activeAccountId = AccountStore.getActiveAccountId();
      // props.activeCourseId = CourseStore.getActiveCourseId();
      // props.courses = CourseStore.getAll();

      // this.update(props);
    }
  });
});