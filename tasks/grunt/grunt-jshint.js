module.exports = {
  all: [ 'src/js/**/*.js', 'test/**/*.js' ],
  src: [ 'src/js/**/*.js' ],
  tests: [ 'test/**/*.js' ],
  jsx: [ 'tmp/compiled/jsx/**/*.js' ],
  options: {
    force: true,
    jshintrc: '.jshintrc',
    '-W098': true,
    reporter: require('jshint-stylish-ex')
    // reporter: 'tasks/jshint_html_reporter.js',
    // reporterOutput: '.jshint.html'
  }
};
