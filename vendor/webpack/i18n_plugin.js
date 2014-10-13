var I18nPlugin = function() {
};

I18nPlugin.prototype.apply = function(compiler) {
  var resourcePrefix = 'i18n!';

  compiler.plugin("normal-module-factory", function(nmf) {
    nmf.plugin("before-resolve", function(result, callback) {
      if(!result) { return callback(); }

      if (result.request.substr(0, 5) === resourcePrefix) {
        var i18nScope = result.request.match(/i18n!(.*)/)[1];

        // no need to specify a file, the loader will generate the module
        // contents itself:
        result.request = 'i18n?scope=' + i18nScope + '!';
        result.i18nRequest = true;
      }

      return callback(null, result);
    });
  });
};

module.exports = I18nPlugin;