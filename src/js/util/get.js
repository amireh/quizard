define([], function() {
  var get = function(attr, callback) {
    var _attr = this[attr];

    // promise property
    if (_attr && _attr.promise) {
      console.assert(callback && callback.call,
        "You must provide a callback to yield with a promise attribute: " + attr);

      return _attr.promise.then(callback.bind(this));
    }
    // function property
    else if (_attr && this[attr].call) {
      return this[attr].call(this);
    }
    else {
      return _attr;
    }
  };

  return get;
});