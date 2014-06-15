define([ 'config' ], function(Config) {
  var locale;
  var defaultLocale = Config.defaultLocale;
  var availableLocales = Config.availableLocales || [];

  /**
   * @method  queryLocale
   * @private
   *
   * Query the requested locale based on the URI.
   * Locale specifier is expected to be the first fragment of the pathname:
   *    http://www.domain.com/XY[extra/fragments]
   * Where XY is the locale code.
   *
   * In case the code is missing, we fall back to Config#defaultLocale.
   *
   * @return {String} The locale code.
   */
  function queryLocale() {
    var query = document.location.pathname.match(/^\/([a-z]{2})(\b|\/)/);

    if (query) {
      return query[1].toLowerCase();
    }
  }

  locale = queryLocale() || defaultLocale;

  if (availableLocales.indexOf(locale) === -1) {
    console.warn('Unsupported locale:', locale, 'defaulting back to:', defaultLocale);
    locale = defaultLocale;
  }

  console.debug('Locale:', locale);

  return locale;
});