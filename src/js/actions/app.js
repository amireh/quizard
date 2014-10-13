var Actions = {};
var Dispatcher = require('core/dispatcher');
var K = require('constants');

Actions.markLoading = function() {
  Dispatcher.dispatch(K.APP_MARK_LOADING_APP_DATA);
};

Actions.unmarkLoading = function() {
  Dispatcher.dispatch(K.APP_UNMARK_LOADING_APP_DATA);
};

module.exports = Actions;