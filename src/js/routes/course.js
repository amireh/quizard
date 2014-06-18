define(function(require) {
  var Route = require('routes/base');
  var CourseStore = require('stores/courses');
  var CourseActions = require('actions/courses');

  new Route('course', {
    model: function(params) {
      return CourseStore.find(params.course_id).then(function(model) {
        CourseActions.activate(model.id);
        return model;
      });
    },

    setup: function(model) {
      this.update({
        activeCourse: model
      });
    }
  });
});