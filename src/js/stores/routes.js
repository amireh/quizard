define(function(require) {
  var Pixy = require('pixy');
  var K = require('constants');
  var router = Pixy.ApplicationRouter;

  var transitionTo = function(destination, onChange, onError) {
    return router.transitionTo(destination).promise.then(onChange, onError);
  };

  var store = new Pixy.Store('routeStore', {
    onAction: function(action, payload, onChange, onError) {
      switch(action) {
        case K.ROUTE_GO_TO_QUIZ:
          this.goToQuiz(payload, onChange, onError);
        break;
      }
    },

    goToQuiz: function(payload, onChange, onError) {
      var url = [
        '/courses', payload.courseId, 'quizzes', payload.quizId
      ].join('/');

      transitionTo(url, onChange, function(error) {
        if (error.status === 404) {
          onError('Quiz with that id could not be located.');
        } else {
          onError(error);
        }
      });
    }
  });

  return store;
});