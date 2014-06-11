define(function(require) {
  var Route = require('routes/base');
  var CourseStore = require('stores/courses');
  var CourseActions = require('actions/courses');

  new Route('course', {
    model: function(params) {
      return CourseStore.find(params.id).then(function(model) {
        CourseActions.activate(model.id);
        return model;
      });
    },

    setup: function(model) {
      console.debug('CourseRoute: in #setup:', model.id);

      this.update({
        activeCourse: model
      });
    }
  });
});