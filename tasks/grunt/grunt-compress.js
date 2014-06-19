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
          'www/assets/fonts/Quizard/fonts/*',
          'www/assets/icons/chrome_96x96_padded.png',
          'www/dist/*',
          'www/index.html',
          'www/favicon.ico',
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
  },

  chrome: {
    options: {
      mode: 'zip',
      archive: function() {
        var info = grunt.file.readJSON('package.json');
        return 'releases/quizard-chrome-' + info.version + '.zip';
      }
    },
    files: [
      {
        expand: true,
        src: [
          'www/assets/fonts/Quizard/fonts/*',
          'www/assets/icons/chrome_16x16.png',
          'www/assets/icons/chrome_96x96_padded.png',
          'www/dist/*',
          'www/index.html',
          'www/favicon.ico'
        ],
        dest: 'quizard/',
        rename: function(dest, src) {
          return dest + src.replace('www/', '');
        }
      },
      {
        expand: true,
        flatten: false,
        src: 'config/chrome/manifest.json',
        rename: function(dest, src) {
          return 'quizard/manifest.json';
        }
      }
    ]
  }
};