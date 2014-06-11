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
      match('/welcome').to('guestIndex');
      match('/login').to('login');

      match('/app').to('app', function(match) {
        match('/').to('appIndex');
        match('/logout').to('logout');

        match('/users').to('users', function(match) {
          match('/').to('userIndex');
          match('/list').to('userList');
          match('/enroll').to('userEnroll');
        });

        match('/quizzes').to('quizzes', function(match) {
          match('/').to('quizIndex');
          match('/:id').to('quiz', function(match) {
            match('/').to('showQuiz');
            match('/take').to('takeQuiz');
          });
        });

        // 404
        match('/*rogueRoute').to('notFound');
      });
    });
  });
});