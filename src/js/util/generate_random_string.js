define(function() {
  return function generateRandomString() {
    return Math.random().toString(36).replace(/[^a-z]+/g, '');
  };
});