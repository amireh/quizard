/* jslint node:true */

var i18n = require('i18next');
var React = require('react');
var slice = [].slice;

module.exports = function(i18nScope) {
  var t = function() {
    var namespace = 'ns_' + i18nScope.replace(/\//g, '.');
    var params = slice.call(arguments);
    var key = params.shift();

    params.unshift([ namespace, key ].join('.'));

    return i18n.t.apply(i18n.t, params);
  };

  /**
   * Use this if you know the value contains any HTML that shouldn't be
   * escaped by React.
   *
   * @return {String}
   */
  t.htmlSafe = function() {
    return React.DOM.span({
      dangerouslySetInnerHTML: { __html: t.apply(t, arguments) }
    });
  };

  return t;
};