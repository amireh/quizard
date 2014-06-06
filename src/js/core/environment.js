define([ 'store', 'jquery', 'underscore' ], function(Storage, $, _) {
  'use strict';

  /**
   * @class Core.Environment
   *
   * A collection of client and browser environment queries.
   */
  var Environment = {
    /**
     * @property {Object} query
     * The extracted GET query parameters. See #parseQueryString
     */
    query: {},

    startedAt: new Date(),

    parseQueryString: function(uri) {
      var pair, k, v, i;
      var query = (uri || window.location.search).substring(1);
      var vars = query.split('&');
      var params = {};

      for (i = 0; i < vars.length; i++) {
        pair = vars[i].split('=');
        k = decodeURIComponent(pair[0]);
        v = decodeURIComponent(pair[1]);

        if (k && k.length) {
          params[ k ] = v;
        }
      }

      return params;
    },

    /**
     * Create or replace a bunch of parameters in the query string.
     *
     * @example
     *   // Say the search has something like ?foo=bar&from=03/01/2014
     *   Env.updateQueryString({
     *     from: "03/28/2014"
     *   });
     *   // => ?foo=bar&from=03/28/2014
     *
     */
    updateQueryString: function(params) {
      this.query = _.extend({}, this.query, params);

      history.pushState('', '', [
        location.pathname,
        decodeURIComponent($.param(this.query))
      ].join('?'));
    },

    getQueryParameter: function(key) {
      return this.query[key];
    },

    removeQueryParameter: function(key) {
      delete this.query[key];
      this.updateQueryString({});
    }
  };

  Environment.query = Environment.parseQueryString();

  return Environment;
});