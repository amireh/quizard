define([
  'ext/pixy',
  'underscore',
  'constants',
  'stores/courses'
], function(Pixy, _, K, CourseStore) {
  var store;

  var collection = new Pixy.Collection(undefined, {
    url: function() {
      var activeCourseId = CourseStore.getActiveCourseId();

      if (!activeCourseId) {
        return undefined;
      }

      return '/courses/' + activeCourseId + '/quizzes';
    }
  });

  store = new Pixy.Store('QuizStore', {
    fetch: function(courseId) {
      return collection.fetch().then(function() {
        return store.getAll();
      }, this.emitError.bind(this));
    },

    getAll: function() {
      return collection.toProps();
    },


    onAction: function(action, payload, onChange, onError) {
      switch(action) {
      }
    }
  });

  return store;
});