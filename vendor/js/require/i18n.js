/** @license
 * RequireJS plugin for namespacing i18next transalations.
 * Author: Ahmad Amireh
 * Version: 0.1.0 (2014/04/05)
 * Released under the MIT license
 */
define([ 'i18next', 'react' ], function(i18n, React) {
  var slice = [].slice;

  return {
    load : function(name, req, onLoad, config) {
      var namespace = 'ns_' + name.replace(/\//g, '.');
      var t = function() {
        var value;
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

      onLoad(t);
    }
  };
});