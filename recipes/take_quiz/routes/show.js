var Route = require('routes/base');
var View = require('../views/preparation_dialog.jsx');

module.exports = new Route('takeQuizRecipeShow', {
  views: [{ component: View, into: 'dialogs' }]
});