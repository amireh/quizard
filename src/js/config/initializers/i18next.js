define([
  'require',
  'config',
  'underscore',
  'i18next',
  'assets/locales/en.json',
  'rsvp',
  './locale'
], function(require, Config, _, i18n, defaultLocale, RSVP, locale) {
  var isString = _.isString;
  var extend = _.extend;

  /**
   * Initialize the i18n engine and load the user locale.
   *
   * @param  {String} userLocale
   *         Locale ISO code.
   *         See Config.availableLocales for the list of available locales.
   */
  function init(userLocale, resolve, reject) {
    var t;
    var namespaceRegex = /([\w|_]+\.)+/;

    // The locale data that will be available for use by the application.
    var locales = {};

    // Localization namespace, used internally by i18next and not by us.
    var namespace = 'translation';

    // i18next config.
    var config  = {
      lng: locale,
      fallbackLng: 'en',
      supportedLngs: Config.availableLocales,
      load: false,
      ns: { namespaces: [ namespace ], defaultNs: namespace },
      useCookie: false,
      useLocalStorage: false,
      lowerCaseLng: true,
      getAsync: false,
      fallbackOnNull: true,
      resGetPath: 'assets/locales/__lng__.json',
      detectLngFromHeaders: false,
      dynamicLoad: false,
      postProcess: 'ensureFallback'
    };

    locales.en = {};
    locales.en[namespace] = defaultLocale.en;

    if (userLocale) {
      try {
        locales[locale] = {};
        locales[locale][namespace] = userLocale[locale];
      } catch(e) {
        console.log('Locale error! Unable to parse locale data: ', userLocale);

        // Die hard on development, this is most probably a missing locale.
        //
        //>>excludeStart("production", pragmas.production);
        reject(e);
        //>>excludeEnd("production");

        // Gracefully fallback to 'en'
        config.lng = locale = 'en';
      }
    }

    config.resStore = locales;

    //>>excludeStart("production", pragmas.production);
    config.debug = true;
    //>>excludeEnd("production");

    i18n.addPostProcessor("ensureFallback", function(value, key/*, options*/) {
      if (value === key) {
        return value.replace(namespaceRegex, '');
      }

      return value;
    });

    i18n.init(config);

    t = i18n.t;
    i18n.t = function(key, defaultValue, options) {
      if (isString(defaultValue)) {
        return t(key, extend({}, options, { defaultValue: defaultValue }));
      }

      return t.apply(this, arguments);
    };

    resolve();
  }

  return function loadLocale() {
    var service = RSVP.defer();

    if (locale !== 'en') {
      require([ 'assets/locales/' + locale + '.json' ], function(userLocale) {
        init(userLocale, service.resolve, service.reject);
      });
    } else {
      init(null, service.resolve, service.reject);
    }

    return service.promise;
  };
});