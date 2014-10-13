var store;

var Pixy = require('pixy');
var Store = require('core/store');
var K = require('constants');
var Quiz = require('models/quiz');
var CourseStore = require('stores/courses');
var extend = require('lodash').extend;

var collection = new Pixy.Collection(undefined, {
  model: Quiz,

  url: function(withoutMeta) {
    var url;
    var activeCourseId = CourseStore.getActiveCourseId();

    if (!activeCourseId) {
      console.assert(false, 'You are attempting to load a quiz but no course is activated.');
      return undefined;
    }

    url = '/courses/' + activeCourseId + '/quizzes';

    if (!withoutMeta) {
      url += '?page=' + (this.meta.currentPage || 1);
    }

    return url;
  }
});

extend(collection, {
  changeModel: function(newModel) {
    var modelAttributes = this.pluck('attributes');

    this._previousModel = this.model;
    this.model = newModel;
    this.reset(modelAttributes, {
      validate: false,
      parse: true,
      silent: true
    });
  },

  restoreModel: function() {
    this.changeModel(this._previousModel);
    delete this._previousModel;
  }
});

store = new Store('QuizStore', {
  collection: collection,

  fetch: function() {
    return collection.fetch().then(function() {
      return store.getAll();
    }, this.emitActionError.bind(this));
  },

  fetchQuestions: function(quizId) {
    var quiz = collection.get(quizId);

    return quiz.questions.fetchAll().then(function() {
      return this.get(quizId);
    }.bind(this));
  },

  onAction: function(action, payload, onChange, onError) {
    switch(action) {
      case K.QUIZ_ACTIVATE:
        this.activate(payload, onChange, onError);
      break;
    }
  },

  reset: function() {
    this.collection.reset();
  }
});

module.exports = store;
