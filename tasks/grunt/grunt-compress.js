var grunt = require('grunt');

module.exports = {
  release: {
    options: {
      mode: 'zip',
      archive: function() {
        var info = grunt.file.readJSON('package.json');
        return 'releases/quizard-' + info.version + '.zip';
      }
    },
    files: [
      {
        expand: true,
        src: [
          'README.md',
          'LICENSE',
          'config/sample-httpd.conf',
          'www/assets/**',
          'www/dist/*',
          'www/index.html',
          'www/chrome.js',
        ],
        dest: 'quizard/'
      },
      {
        expand: true,
        flatten: false,
        src: 'config/chrome/manifest.json',
        rename: function(dest, src) {
          return 'quizard/www/manifest.json';
        }
      }
    ]
  }
};