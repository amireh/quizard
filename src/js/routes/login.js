define([
  'routes/secondary',
  'jsx!views/login',
  'stores/sessions',
  'constants'
], function(SecondaryRoute, Dialog, Store, K) {
  new SecondaryRoute('login', {
    accessPolicy: 'public',

    views: [{
      component: Dialog,
      into: 'dialogs'
    }],

    windowTitle: 'Login - Quizard',

    enter: function() {
      Store.addActionErrorListener(K.SESSION_CREATE,
        this.injectStoreError, this);
    },

    exit: function() {
      Store.removeActionErrorListener(K.SESSION_CREATE, null, this);
    }
  });
});