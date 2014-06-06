module.exports = {
  unit: {
    options : {
      timeout: 10000,
      outfile: 'tests.html',

      host: 'http://127.0.0.1:<%= grunt.config.get("connect.tests.options.port") %>/',

      template: require('grunt-template-jasmine-requirejs'),
      templateOptions: {
        requireConfigFile: [
          'src/js/main.js',
          'test/config.js',
          'test/config-unit.js'
        ],
        deferHelpers: true,
        defaultErrors: false
      },

      keepRunner: true,

      version: '2.0.0',

      styles: [ 'www/dist/pibi.css', 'test/overrides.css' ],

      helpers: [
        'test/support/jasmine/jasmine_sinon.js',
        'test/support/phantomjs_polyfills.js',
        'test/support/route_tests.js',
        'test/vendor/*.js',
        'test/helpers/test_fixtures.js'
      ],

      specs: [
        'test/unit/**/*.js'
      ]
    }
  }
};