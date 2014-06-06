define([ 'inflection' ], function() {
  'use strict';

  return function(string) {
    return string.
      trim().
      toLowerCase().
      replace(/\s+/g, ' ').
      replace(/\s/g, '_').
      underscore();
  };
});