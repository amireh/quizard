define(function(require) {
  var Pixy = require('pixy');
  var Store = require('core/store');
  var K = require('constants');
  var Course = require('models/course');
  var NOOP = require('util/noop');

  var collection = new Pixy.Collection(undefined, {
    model: Course,
    url: '/courses',
    cache: {
      key: 'courses',
      manual: true
    }
  });

  return new Store('CourseStore', {
    collection: collection,

    /**
     * Get all available courses, relying on the cache as the first source.
     */
    fetch: function() {
      var cachedId = this.preference('active');
      this.clearPreference('active');

      collection.reset();

      return collection.fetch({ useCache: true }).catch(function() {
        return collection.fetchAll({ useCache: false });
      }).then(function() {
        collection.updateCacheEntry();

        if (cachedId) {
          this.activate({ id: cachedId }, this.emitChange.bind(this), NOOP);
        }

        return this.getAll();
      }.bind(this));
    },

    getActiveCourseId: function() {
      return this.activeItemId;
    },

    onAction: function(action, payload, onChange, onError) {
      switch(action) {
        case K.COURSE_ACTIVATE:
          this.activate(payload, onChange, onError);
        break;
      }
    }
  });
});