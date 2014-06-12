define(function() {
  return function(rc, body) {
    return [ rc, { 'Content-Type': 'application/json' }, JSON.stringify(body || {}) ];
  };
});
