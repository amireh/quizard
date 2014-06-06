module.exports = {
  options: {
    nospawn: true,
    spawn: false
  },

  // lint: {
  //   files: [ 'src/js/**/*.js' ],
  //   tasks: [ 'newer:jshint' ]
  // },

  css: {
    files: '{src,vendor}/css/**/*.{less,css}',
    tasks: [ 'less', 'notify:less' ]
  },

  locales: {
    files: 'www/assets/locales/**/*.yml',
    tasks: [ 'locales', 'notify:locales' ]
  },

  docs: {
    files: [ '.jsduck', 'doc/guides/**/*.md', 'doc/*.*' ],
    tasks: [ 'docs', 'notify:docs' ]
  },

  jsx: {
    files: 'src/js/**/*.jsx',
    tasks: [ 'newer:react', 'jshint:jsx' ]
  },

  tests: {
    files: [ 'src/js/**/*.js', 'test/**/*' ],
    tasks: [ 'test' ]
  }
};
