define(function(require) {
  var Pixy = require('pixy');
  var User = require('./user');
  var K = require('constants');

  var Account = Pixy.Model.extend({
    name: 'Account',
    urlRoot: '/accounts',

    initialize: function() {
      var account = this;

      this.users = new Pixy.Collection(undefined, {
        model: User,
        url: function() {
          var query = [
            'page=' + (this.meta.nextPage || 1),
            'per_page=' + K.USER_MAX_PER_PAGE,
          ].join('&');

          return account.url() + '/users?' + query;
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