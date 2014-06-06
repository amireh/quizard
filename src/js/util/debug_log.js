define([], function() {
  var slice = Array.prototype.slice;

  return function(context) {
    return function log() {
      //>>excludeStart("production", pragmas.production);
      var params;

      params = slice.call(arguments);
      params.unshift(context + ':');

      console.debug.apply(console, params);
      //>>excludeEnd("production");
    }
  };
});