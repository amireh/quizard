var RSVP = require('rsvp');

RSVP.configure('onerror', function(e) {
  console.error(e);

  if (e.message) {
    console.error(e.message);
  }

  if (e.stack) {
    console.error(e.stack);
  }
});

module.exports = DEBUG;