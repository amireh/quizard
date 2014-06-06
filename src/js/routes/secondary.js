define([ 'routes/base' ], function(BaseRoute) {
  var Route;

  Route = BaseRoute.extend({
    isSecondary: true
  });

  return Route;
});