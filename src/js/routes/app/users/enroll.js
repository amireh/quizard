define([
  'routes/base',
  'jsx!views/app/users/enroll'
], function(Route, View) {
  new Route('userEnroll', {
    views: [{ component: View }],
    enter: function() {
      this.update({
        navbar: {
          item: '/app/users',
          child: '/app/users/enroll'
        }
      });
    }
  });
});