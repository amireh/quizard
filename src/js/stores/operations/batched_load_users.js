define(function(require) {
  var K = require('constants');
  var BatchedOperation = require('models/batched_operation');
  var t = require('i18n!load_students');
  var RSVP = require('rsvp');

  var loadUsers = new BatchedOperation({
    runner: function(context) {
      var collection = context.collection;
      var nextPage;

      if (!context.page) {
        context.page = 0;

        if (context.reset) {
          collection.reset();
        }
      }

      nextPage = ++context.page;

      if (collection.meta.hasMore === false && !collection.meta.cached) {
        context.operation.mark(t('status_no_more_students'));
        return RSVP.resolve();
      }

      context.operation.mark(t('status', {
        page: nextPage,
        perPage: K.USER_MAX_PER_PAGE
      }), nextPage);

      return collection.fetchNext({ page: nextPage, useCache: false });
    },

    onDone: function(output, context) {
      context.collection.updateCacheEntry();
      context.operation.mark();
      context.emitChange();
      return true;
    },

    onError: function(error, context, resolve, reject) {
      context.operation.markLastActionFailed();
      context.emitChange();
      resolve();
    }
  });

  return loadUsers;
});