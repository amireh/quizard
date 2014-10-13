var RSVP = require('rsvp');
var Promise = function(handler) {
  return new RSVP.Promise(handler);
};

Promise.defer = RSVP.defer;
Promise.all = RSVP.all;

module.exports = Promise;