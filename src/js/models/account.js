define(function(require) {
  var Pixy = require('pixy');
  var User = require('./user');
  var K = require('constants');
  var Account, Users;

  Account = Pixy.Model.extend({
    name: 'Account',
    urlRoot: '/accounts',

    initialize: function() {
      this.users = new Users(undefined, { account: this });
    },

    toProps: function() {
      return {
        id: this.get('id') + '',
        name: this.get('name')
      };
    }
  });

  Users = Pixy.Collection.extend({
    name: 'Users',
    model: User,

    initialize: function(models, options) {
      this.account = options.account;
    },

    cache: {
      manual: true,

      key: function() {
        if (!this.account.isNew()) {
          return [ 'users', this.account.get('id') ].join('_');
        }
      }
    },

    url: function() {
      var query = [
        'page=' + (this.meta.nextPage || 1),
        'per_page=' + K.USER_MAX_PER_PAGE,
      ].join('&');

      return this.account.url() + '/users?' + query;
    },

    toJSON: function() {
      return this.map(function(user) {
        return {
          id: user.get('id')
        };
      });
    }
  });

  return Account;
});