define([
  'ext/jquery',
  'ext/jquery/ajax',
  'config',
  'jquery.qtip'
], function($, ajax, Config) {
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

  // Disable disabled links!
  $(document.body).on('click', '.disabled, :disabled', $.consume);

  $.fn.qtip.defaults.position.adjust.resize = false;

  Pixy.ajax = ajax({
    host:     Config.apiHost,
    timeout:  Config.xhr.timeout
  });

  return $;
});
