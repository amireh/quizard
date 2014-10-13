/* jslint node:true */

var path = require('path');
// var webpack = require('webpack');
// var I18nPlugin = require('vendor/webpack/i18n_plugin');

var jsRoot = path.join(__dirname, '..', '..', 'src', 'js');
// var jsRoot = __dirname;

module.exports = {
  entry: path.join(__dirname, 'main.js'),
  context: jsRoot,
  output: {
    path: path.join(jsRoot, 'www', 'dist', 'recipes'),
    filename: 'take_quiz.js',
    libraryTarget: 'var',
    publicPath: '/dist/recipes/'
  },

  plugins: [
    // new I18nPlugin()
  ],

  externals: [
    /^(pixy|underscore)$/
  ],

  resolve: {
    root: jsRoot,

    modulesDirectories: [
    ],

    extensions: [ '', '.js', '.jsx' ],

    alias: {
    }
  }
};