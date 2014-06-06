/* global jasmine: true */

var root = jasmine.getGlobal();
var afterAll_ = [];
var runner = jasmine.getEnv().currentRunner();
var finishCallback = runner.finishCallback;

runner.finishCallback = function() {
  _.each(afterAll_, function(callback) { callback(); });
  return finishCallback.apply(this, arguments);
};

/**
 * Execute a callback after all specs have been finished.
 *
 * @param  {Function} callback
 */
root.afterAll = function(callback) {
  afterAll_.push(callback);
};