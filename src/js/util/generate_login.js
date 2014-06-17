define(function(require) {
  var sanitize = require('./sanitize');

  return function generateLogin(idPrefix, id) {
    return [
      sanitize(idPrefix),
       '' + (Math.abs(parseInt(id, 10) || 0))
    ].join('_');
  };
});