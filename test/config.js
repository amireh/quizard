/* global requirejs: false, jasmine: false */
requirejs.config({
  baseUrl: './src/js',
  map: {
    '*': {
      'test': '../../test',
      'fixtures': '/test/fixtures'
    }
  },

  paths: {
    'json': '../../vendor/js/require/json',
    'router': '../../vendor/js/pixy',
    'rsvp': '../../vendor/js/pixy'
  },

  deps: [
    'json', 'router'
  ]
});