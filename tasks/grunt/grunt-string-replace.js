module.exports = {
  version: {
    files: {
      'www/index.html': "www/index.html",
      "www/pibi.appcache": "www/pibi.appcache"
    },
    options: {
      replacements: [{
        pattern: /\d\.\d{1,}\.\d+/,
        replacement: "<%= grunt.config.get('pkg.version') %>"
      }, {
        pattern: /version(\s*)=(\s*)\"\d\.\d{1,}\.\d+/,
        replacement: "version$1=$2\"<%= grunt.config.get('pkg.version') %>"
      }]
    }
  }
};