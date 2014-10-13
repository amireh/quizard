/* jslint node:true */

var path = require('path');
var webpack = require('webpack');
var I18nPlugin = require('./vendor/webpack/i18n_plugin');

var jsRoot = path.join(__dirname, 'src', 'js');

var config = [{
  entry: './boot.js',
  context: jsRoot,
  output: {
    path: path.join(__dirname, 'www', 'dist'),
    filename: 'quizard.js',
    libraryTarget: 'var',
    publicPath: '/dist/'
  },

  plugins: [
    new I18nPlugin(),
    new webpack.IgnorePlugin(/README|^main.js$/)
  ],

  resolve: {
    root: jsRoot,

    modulesDirectories: [
      './',
      './vendor/js',
      './node_modules',
      './node_modules/router/dist/commonjs'
    ],

    extensions: [ '', '.js', '.jsx' ],

    alias: {
      'i18next$': 'i18next.amd-1.6.3.js',

      'inflection$': 'vendor/js/inflection.js',
      'route-recognizer$': 'node_modules/pixy/vendor/route-recognizer.js',
      'router$': 'node_modules/router/dist/commonjs/router/router.js',
      'rsvp': 'node_modules/rsvp/lib/rsvp',
      'rsvp$': 'node_modules/rsvp/rsvp.js',
      'pixy$': 'node_modules/pixy/lib/pixy/main.js',

      // Use react-with-addons
      'react$': 'react/addons.js',
      'lodash$': 'lodash.custom.js',
      'underscore$': 'lodash',

      'jquery$': 'jquery/jquery-2.0.2.js',
      'jquery.jquerypp$': 'jquery/jquerypp.custom.js',
      'jquery.qtip$': 'jquery/jquery.qtip.js',
      'jquery.chosen$': 'jquery/jquery.chosen.js',

      'assets': 'www/assets',
    }
  },

  resolveLoader: {
    modulesDirectories: [
      './vendor/webpack',
      './node_modules'
    ],
  },

  externals: {
    'assets/locales/ar.json': true
  },

  module: {
    noParse: [
    ],
    loaders: [
      { test: /rsvp\/.*.js$/, loader: 'es6-loader' },
      { test: /jsx/, loader: 'jsx-loader' },
      { test: /\.json$/, loader: 'json-loader' },
    ]
  }
}];

var recipe = require(path.join(__dirname,"recipes/take_quiz/webpack.config.js"));

if (!recipe.resolve) {
  recipe.resolve = {};
}
// if (!recipe.resolve.modulesDirectories) {
//   recipe.resolve.modulesDirectories = [];
// }

// recipe.resolve.modulesDirectories = recipe.resolve.modulesDirectories.concat([
//   // path.join(__dirname),
//   path.join(__dirname, 'vendor', 'js'),
//   path.join(__dirname, 'node_modules'),
//   path.join(__dirname, 'node_modules', 'router', 'dist', 'commonjs'),
// ]);

// console.log(recipe);

// config.push(recipe);

module.exports = config[0];