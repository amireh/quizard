module.exports = {
  unit: {
    options : {
      timeout: 1000,
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

      styles: [ 'www/dist/quizard.css', 'test/overrides.css' ],

      helpers: [
        'test/vendor/*.js'
      ],

      specs: [
        'test/unit/**/*.js'
      ]
    }
  }
};