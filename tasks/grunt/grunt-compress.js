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
          'www/assets/locales/*',
          'www/dist/*',
          'www/index.html',
        ],
        dest: 'quizard/'
      }
    ]
  }
};