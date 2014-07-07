/* jslint node: true */
var shell = require('shelljs');

module.exports = function(grunt, config, readPackage, loadFrom) {
  'use strict';

  console.log('Quizard: development mode engaged.');

  loadFrom('./tasks/development/options/', config);

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-bumpup');
  grunt.loadNpmTasks('grunt-tagrelease');
  grunt.loadNpmTasks('grunt-jsvalidate');
  grunt.loadNpmTasks('grunt-jsduck');
  grunt.loadNpmTasks('grunt-notify');
  grunt.loadNpmTasks('grunt-string-replace');
  grunt.loadNpmTasks('grunt-react');
  grunt.loadNpmTasks('grunt-newer');
  grunt.loadNpmTasks('grunt-contrib-symlink');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-yaml');
  grunt.loadNpmTasks('grunt-contrib-compress');

  grunt.registerTask('compile:js', [
    'symlink:compiled',
    'requirejs:compile',
    'clean:compiled_symlink'
  ]);

  grunt.registerTask('compile:css', [ 'less' ]);

  grunt.registerTask('updatePkg', function () {
    grunt.config.set('pkg', readPackage());
  });

  grunt.registerTask('test', [
    'symlink:assets', 'connect:tests', 'jasmine:unit', 'clean:assets'
  ]);
  grunt.registerTask('docs',  [ 'react', 'jsduck' ]);
  grunt.registerTask('version', [ 'string-replace:version' ]);
  grunt.registerTask('build', [
    'clean:compiled',
    'react',
    'compile:js',
    'compile:css'
  ]);

  // Release alias task
  grunt.registerTask('release', function (type) {
    grunt.task.run('test');
    grunt.task.run('bumpup:' + ( type || 'patch' ));
    grunt.task.run('updatePkg');
    grunt.task.run('version');
    grunt.task.run('build');
    grunt.task.run('tagrelease');
    grunt.task.run('compress');
  });

  grunt.registerTask('development',
  'Prepares a live reload development environment.',
  function() {
    shell.exec('rm www/dist/quizard.js &> /dev/null');
    shell.exec('cd www/dist; ln -s ../../src/js/main.js ./quizard.js');
    shell.exec('cd www/; ln -s ../src ./');
    shell.exec('cd www/; ln -s ../vendor ./');

    grunt.task.run('compile:css');
  });
};