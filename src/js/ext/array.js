define([], function() {
  Array.wrap = function(arr) {
    if (!Array.isArray(arr)) {
      return [ arr ];
    }

    return arr;
  };

  return Array;
});