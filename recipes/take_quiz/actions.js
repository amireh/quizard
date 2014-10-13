var Actions = {};
var Pixy = require('pixy');
var Promise = require('core/promise');
var router = Pixy.ApplicationRouter;

var transitionTo = function(destination, onChange, onError) {
  return router.transitionTo(destination).promise.then(onChange, onError);
};

Actions.goToQuiz = function(courseId, quizId, quizAction) {
  var url = [ '/recipes/take_quiz/courses', courseId, 'quizzes', quizId ];

  if (quizAction) {
    url.push(quizAction);
  }

  url = url.join('/');

  return new Promise(function(resolve, reject) {
    transitionTo(url, resolve, function(error) {
      if (error.status === 404) {
        reject('Quiz with that id could not be located.');
      } else {
        reject(error);
      }
    });
  });
};

module.exports = Actions;