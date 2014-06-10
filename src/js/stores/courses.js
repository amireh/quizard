define([
  'ext/pixy',
  'constants',
  'models/course'
], function(Pixy, K, Course) {
  var store, activeCourseId;
  var collection = new Pixy.Collection(undefined, {
    model: Course,
    url: '/courses'
  });

  var get = function(id) {
    return collection.get(id);
  };

  var activate = function(payload, onChange, onError) {
    var course = get(payload.id);

    if (course) {
      activeCourseId = payload.id;
      localStorage.setItem('activeCourseId', payload.id);

      onChange();
    } else {
      onError("Account with the id " + payload.id + " could not be resolved.");
    }
  };

  store = new Pixy.Store('CourseStore', {
    fetch: function() {
      return collection.fetch().then(function() {
        return store.getAll();
      });
    },

    getAll: function() {
      return collection.toProps();
    },

    getActiveCourseId: function() {
      return activeCourseId;
    },

    onAction: function(action, payload, onChange, onError) {
      switch(action) {
        case K.COURSE_ACTIVATE:
          activate(payload, onChange, onError);
        break;
      }
    }
  });

  return store;
});