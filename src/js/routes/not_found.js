var SecondaryRoute = require('routes/secondary');
var View = require('views/not_found.jsx');

module.exports = new SecondaryRoute('notFound', {
  windowTitle: '404 - Quizard',
  views: [{
    component: View,
    into: 'dialogs'
  }],

  beforeModel: function(transition) {

  }
});