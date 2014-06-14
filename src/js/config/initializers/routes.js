define([
  'ext/pixy',
  'constants',
  'rsvp',
  'bundles/routes'
], function(Pixy, K, RSVP) {
  'use strict';

  var router, bundle;

  router = Pixy.ApplicationRouter;
  bundle = Pixy.routeMap;

  router.getHandler = function(name) {
    var handler = bundle[name];

    if (!handler) {
      console.error('No route handler found for', name);
      return RSVP.reject(K.ERROR_NOT_FOUND);
    }

    return bundle[name];
  };

  router.map(function(match) {
    match('/').to('root', function(match) {
      match('/').to('index');
      match('/login').to('login');
      match('/logout').to('logout');

      // Recipes
      match('/recipes/enroll_students').to('enrollStudentsRecipe', function(match) {
        match('/').to('enrollStudentsForm');
        match('/progress').to('enrollStudentsProgress');
      });

      match('/recipes/take_quiz').to('takeQuizRecipe');

      // App
      match('/courses/:course_id').to('course', function(match) {
        match('/quizzes/:quiz_id').to('quiz', function(match) {
          match('/').to('quizShow');
          match('/take').to('takeQuiz');
        });
      });

      // 404
      match('/*rogueRoute').to('notFound');
    });
  });
});