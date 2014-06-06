define([
  'ext/pixy',
  'routes/app',
  'routes/not_found',
  'routes/index',
  'routes/login',
  'routes/logout',
  'routes/users',
  'routes/users/index',
  'routes/users/list',
], function(Pixy) {
  return {
    routeMap: Pixy.routeMap,
    setup: function(router) {
      router.map(function(match) {
        match('/').to('app', function(match) {
          match('/').to('index');

          // Auth
          match('/login').to('login');
          match('/logout').to('logout');

          match('/users').to('users', function(match) {
            match('/').to('userIndex');
            match('/list').to('userList');
          });

          // 404
          match('/*rogueRoute').to('notFound');
        });
      });
    }
  };
});