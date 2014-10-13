/* jslint node:true */

var fs = require('fs');
var path = require('path');
var t = fs.readFileSync(path.join(__dirname, './t.js')).toString();

// get rid of the trailing ; in `module.exports = ...;`
t = t.substring(0, t.length - 1);

module.exports = function() {
  if (this.cacheable) { this.cacheable(); }

  var scope = this.query.replace('?scope=', '');

  console.log('Generating I18n.t() for:', scope);

  return t + '("' + scope + '");';
};