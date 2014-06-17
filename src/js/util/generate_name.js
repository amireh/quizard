define(function(require) {
  var generateLogin = require('./generate_login');

  return function generateName(idPrefix, id) {
    var loginId;

    if (arguments.length === 2) {
      loginId = generateLogin(idPrefix, id);
    } else {
      loginId = idPrefix;
    }

    return loginId.titleize();
  };
});