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

  // Disable disabled links!
  $(document.body).on('click', '.disabled, :disabled', $.consume);

  $.fn.qtip.defaults.position.adjust.resize = false;

  return $;
});
