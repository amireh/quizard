define([
  'ext/pixy',
  'underscore',
  'constants',
  'models/quiz',
  'stores/courses'
], function(Pixy, _, K, Quiz, CourseStore) {
  var store, activeQuizId;

  var collection = new Pixy.Collection(undefined, {
    model: Quiz,
    url: function(withoutMeta) {
      var url;
      var activeCourseId = CourseStore.getActiveCourseId();

      if (!activeCourseId) {
        return undefined;
      }

      url = '/courses/' + activeCourseId + '/quizzes';

      if (!withoutMeta) {
        url += '?page=' + (this.meta.currentPage || 1);
      }

      return url;
    }
  });

  var loadMore = function(done, error) {
    debugger
    collection.fetchNext().then(function() {
      done('data');
    }, error);
  };

  var activate = function(payload, onChange, onError) {
    var quizId = payload.id;
    var quiz;
    var done = function() {
      activeQuizId = quizId;
      onChange();
    };

    quiz = collection.get(quizId);

    if (!quiz) {
      quiz = collection.add([{ id: quizId }]).get(quizId);
      quiz.fetch().then(done, onError);
    } else {
      done();
    }
  };

  store = new Pixy.Store('QuizStore', {
    fetch: function() {
      return collection.fetch().then(function() {
        return store.getAll();
      }, this.emitActionError.bind(this));
    },

    getAll: function() {
      return collection.toProps();
    },

    getActiveQuiz: function() {
      if (!activeQuizId) {
        return;
      }

      return collection.get(activeQuizId).toProps();
    },

    getActiveQuizId: function() {
      return activeQuizId;
    },

    hasMore: function() {
      return collection.meta.hasMore;
    },

    onAction: function(action, payload, onChange, onError) {
      switch(action) {
        case K.QUIZ_LOAD_MORE:
          loadMore(onChange, onError);
        break;

        case K.QUIZ_ACTIVATE:
          activate(payload, onChange, onError);
        break;
      }
    }
  });

  return store;
});