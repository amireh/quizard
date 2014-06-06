define([ 'ext/pixy', 'models/course' ], function(Pixy, Course) {
  var store;
  var collection = new Pixy.Collection(undefined, {
    model: Course,
    url: '/courses'
  });

  store = new Pixy.Store('CourseStore', {
    fetch: function() {
      return collection.fetch().then(function() {
        return store.getAll();
      });
    },

    getAll: function() {
      return collection.invoke('toProps');
    }
  });

  return store;
});