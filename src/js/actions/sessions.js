define([ 'core/dispatcher', 'constants' ],
function(Dispatcher, K) {
  return {
    constants: K,

    /**
     * Log in.
     *
     * @param  {String} apiToken
     * @param  {String} password
     *
     * @return {}
     */
    create: function(apiToken) {
      return Dispatcher.dispatch(K.SESSION_CREATE, {
        apiToken: apiToken
      });
    },

    /**
     * Log out.
     */
    destroy: function() {
      return Dispatcher.dispatch(K.SESSION_DESTROY);
    }
  };
});