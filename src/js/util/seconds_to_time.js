define(function() {
  return function secondsToTime(seconds) {
    var floor = function(nr) { return Math.floor(nr); };
    var pad = function(duration) {
      return ('00' + duration).slice(-2);
    };

    seconds = parseInt(seconds || 0, 10);

    if (seconds > 3600) {
      var hh = floor(seconds / 3600);
      var mm = floor((seconds - hh*3600) / 60);
      var ss = seconds % 60;

      return [pad(hh), pad(mm), pad(ss)].join(':');
    } else if (seconds > 0 && seconds < 3600) {
      return [pad(floor(seconds / 60)), pad(floor(seconds % 60))].join(':');
    } else {
      return;
    }
  };
});