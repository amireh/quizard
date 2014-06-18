define([ 'ext/underscore', 'pixy', 'models/user' ],
  function(_, Pixy, User) {

  /**
   * @class  Core.Session
   * @extends Pixy.Model
   * @singleton
   *
   * An authenticated session with the Canvas API servers. Please don't use
   * this directly, use the SessionStore instead.
   */
  var Session = Pixy.Model.extend({
    name: 'Session',
    url: '/users/self/profile',

    defaults: {
      id: undefined,
      active: false
    },

    /**
      * Create a new Session with its own users collection.
      */
    initialize: function() {
      /**
       * @property {Models.User} user
       * The current user. Might not be an authentic one.
       */
      this.user = new User();

      Pixy.Registry.registerModule('user', this.user);
    }
  });

  return new Session();
});
