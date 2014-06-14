define(function(require) {
  var InflectionJS = require('inflection');
  var sanitize = require('./sanitize');

  return function(idPrefix, id) {
    return [
      sanitize(idPrefix),
       '' + (Math.abs(parseInt(id, 10) || 0))
    ].join('_');
  }
});