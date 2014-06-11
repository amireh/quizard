define(function(require) {
  var Pixy = require('ext/pixy');
  var Store = require('core/store');
  var K = require('constants');
  var Course = require('models/course');
  var NOOP = require('util/noop');

  var collection = new Pixy.Collection(undefined, {
    model: Course,
    url: '/courses'
  });

  return new Store('CourseStore', {
    collection: collection,

    fetch: function() {
      var cachedId = this.preference('active');
      this.clearPreference('active');

      return collection.fetch().then(function() {
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