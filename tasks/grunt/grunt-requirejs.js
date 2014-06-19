module.exports = {
  compile: {
    options: {
      baseUrl: 'src/js',
      out: 'www/dist/quizard.js',
      mainConfigFile: 'src/js/main.js',
      optimize: 'uglify2',

      removeCombined:           false,
      inlineText:               true,
      preserveLicenseComments:  false,

      uglify2: {
        warnings: true,
        mangle:   true,

        output: {
          beautify: false
        },

        compress: {
          sequences:  true,
          dead_code:  true,
          loops:      true,
          unused:     true,
          if_return:  true,
          join_vars:  true
        }
      },

      pragmasOnSave: {
        excludeHbsParser:   true,
        excludeHbs:         true,
        excludeAfterBuild:  true
      },

      pragmas: {
        production: true
      },

      name: 'main',
      include: [ 'main' ],
      exclude: [ 'text', 'jsx' ]

      ,onBuildWrite: function (moduleName, path, singleContents) {
        return singleContents.replace(/(text!|jsx!)/g, '');
      }
    }
  }
};