var Root = this;
var DEBUG = {
  toString: function() {
    return 'DEBUG';
  }
};

!Root.PIXY_TEST && define([
  'config',
  'rsvp',
  'util/diff'
],
function(CONFIG, RSVP, diff) {
  DEBUG.RSVP = RSVP;
  DEBUG.DELAY_TIMER = 500;

  RSVP.configure('onerror', function(e) {
    console.error(e);

    if (e.message) {
      console.error(e.message);
    }

    if (e.stack) {
      console.error(e.stack);
    }
  });

  Root.DEBUG = Root.d = DEBUG;

  DEBUG.diff = function(_a, _b) {
    var output;
    var clone = _.clone;
    var a, b;

    a = clone(_a || {});
    b = clone(_b || {});

    try {
      output = JSON.stringify(diff.rusDiff(a, b));
    } catch(e) {
      // console.warn('Unable to diff:', e.message);
      // console.warn(e.stack);

      // console.debug(typeof a, typeof b);
      // console.debug(a);
      // console.debug(b);

      DEBUG._diffA = a;
      DEBUG._diffB = b;

      return;
    }

    return output;
  }

  DEBUG.expose = function(path, name, callback) {
    if (arguments.length < 2) {
      throw "Must provide a filepath and a variable name to expose into";
    }

    require([path], function(__var) {
      DEBUG[name] = __var;

      if (callback) {
        callback(__var);
      }
    });
  };

  DEBUG.expose('stores/app', 'appStore');
  DEBUG.expose('core/session', 'session');
  DEBUG.expose('stores/accounts', 'accountStore');
  DEBUG.expose('stores/users', 'userStore');
  DEBUG.expose('stores/courses', 'courseStore');
  DEBUG.expose('stores/quizzes', 'quizStore');
  DEBUG.expose('stores/quiz_taking', 'quizTakingStore');
  DEBUG.expose('stores/operations', 'operationStore');
  DEBUG.expose('core/ajax', 'ajax');

  DEBUG.listeners = function(obj) {
    return _.uniq(_.flatten(Object.keys(obj._events).map(function(name) {
      return _.pluck(obj._events[name], 'ctx');
    })));
  }
});