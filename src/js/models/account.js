define([ 'ext/pixy', 'models/user' ], function(Pixy, User) {
  var Account = Pixy.Model.extend({
    name: 'Account',
    urlRoot: '/accounts',

    initialize: function() {
      var account = this;

      this.users = new Pixy.Collection(undefined, {
        model: User,
        url: function() {
          return account.url() + '/users';
        }
      });
    },

    toJSON: function() {
      return {
        id: this.get('id') + '',
        name: this.get('name')
      };
    }
  });

  return Account;
});