/* jslint node: true */
var config;
var glob = require('glob');
var path = require('path');

module.exports = function(grunt) {
  'use strict';

  function readPackage() {
    return grunt.file.readJSON('package.json');
  };

  function loadFrom(path, config) {
    var glob = require('glob'),
    object = {};

    glob.sync('*', {cwd: path}).forEach(function(option) {
      var key = option.replace(/\.js$/,'').replace(/^grunt\-/, '');
      config[key] = require(path + option);
    });
  };

  config = {
    pkg: readPackage(),
    env: process.env
  };

  loadFrom('./tasks/options/', config);

  grunt.initConfig(config);
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-connect-rewrite');
  grunt.loadNpmTasks('grunt-connect-proxy');

  if (!process.env.production) {
    require('./tasks/Gruntfile.development')(grunt, config, readPackage, loadFrom);
  }

  grunt.registerTask('server', [ 'configureProxies:www', 'connect:www' ]);
  grunt.registerTask('default', [ 'server' ]);
};
