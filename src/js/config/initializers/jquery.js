define([
  'ext/jquery',
  'jquery.qtip'
], function($) {
  'use strict';

  $.ajaxSetup({
    converters: {
      "text json": function (response) {
        response = $.trim(response);

        if (!response.length) {
          response = '{}';
        }

        return $.parseJSON(response);
      }
    }
  });

  /**
   * Redirect all requests that have a "transport" option of "localStorage" to
   * the localStorage transporter.
   *
   * @private
   */
  $.ajaxPrefilter('*', function(options) {
    if (options.transport === 'localStorage') {
      return 'application/vnd.cache+json';
    }
  });

  /**
   * Serve cached versions of resources from localStorage instead of querying
   * the API.
   *
   * This is an opt-in mechanism. The caller of $.ajax() (or $.ajaxCORS()) has
   * to explicitly request that the data _it_ provides should be served as if
   * from the remote server.
   *
   * This transporter doesn't really query localStorage or anything, it just
   * wraps the data it receives from the caller in an XHR response that external
   * components can treat as if it has been fetched from a remote endpoint.
   *
   *     var xhr = $.ajax({
   *       transport: "localStorage",
   *       data: { name: "My cached object" }
   *     });
   *
   *     // handle here as you would if the request was really fetched remotely
   *     xhr.then(function(object) {
   *       object.name; // => "My cached object"
   *     });
   *
   *     // no cached version was found, you can fallback to fetching from
   *     // remote now
   *     xhr.otherwise(function(xhr) {
   *       return $.ajax({
   *         type: "GET",
   *         url: "/path/to/object"
   *       });
   *     });
   *
   * @private
   * @method ajaxTransport
   */
  $.ajaxTransport('application/vnd.cache+json', function(options, inbound/*, jqXHR*/) {
    var status, statusText;
    var cachedResponse = inbound.data;

    options.dataTypes.shift();
    options.dataTypes.unshift('json');

    return {
      send: function(headers, completeCallback) {
        if (cachedResponse) {
          status = 200;
          statusText = 'success';
        } else {
          status = 404;
          statusText = 'error';
        }

        completeCallback(status, statusText, {
          json: cachedResponse
        });

        cachedResponse = null;
      },

      abort: function() {
        cachedResponse = null;
      }
    };
  });

  // Disable disabled links!
  $(document.body).on('click', '.disabled, :disabled', $.consume);

  $.fn.qtip.defaults.position.adjust.resize = false;

  return $;
});
