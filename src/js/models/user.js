define([ 'ext/pixy' ], function(Pixy) {

  /**
   * @class Models.User
   *
   * The Admin or one of them students.
   */
  var User = Pixy.Model.extend({
    name: 'User',
    urlRoot: '/users',

    initialize: function() {
    },

    toJSON: function() {
      var props = this.pick('name', 'email', 'login_id');

      props.id = this.get('id') + '';

      return props;
    }
  });

  return User;
});