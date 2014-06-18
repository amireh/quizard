define([ 'pixy' ], function(Pixy) {

  /**
   * @class Models.User
   *
   * The Admin or one of them students.
   */
  var User = Pixy.Model.extend({
    name: 'User',

    initialize: function() {
    },

    toProps: function() {
      var props = this.pick('name', 'email', 'login_id');

      props.id = this.get('id') + '';

      return props;
    }
  });

  return User;
});