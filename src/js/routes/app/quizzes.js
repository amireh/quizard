define([ 'routes/base' ], function(Route) {
  new Route('quizzes', {
    accessPolicy: 'private',
    enter: function() {
      this.update({
        navbar: {
          item: '/app/quizzes'
        }
      });
    }
  });
});