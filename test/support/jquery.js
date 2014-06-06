require([ 'ext/jquery' ], function($) {
  /**
   * [click description]
   * @param  {[type]} $selector [description]
   * @return {[type]}           [description]
   */
  $.click = function($selector) {
    var event = $.Event('click');
    $selector.trigger(event);
    return event.result;
  };
});