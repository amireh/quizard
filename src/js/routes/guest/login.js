define([
  'routes/secondary',
  'jsx!views/guest/login',
  'stores/sessions',
  'constants'
], function(SecondaryRoute, Dialog, Store, K) {
  new SecondaryRoute('login', {
    accessPolicy: 'public',
    windowTitle: 'Login - Quizard',

    views: [{
      component: Dialog,
      into: 'dialogs'
    }],

    enter: function() {
      Store.addActionErrorListener(K.SESSION_CREATE,
        this.injectStoreError, this);
    },

    exit: function() {
      Store.removeActionErrorListener(K.SESSION_CREATE, null, this);
    }
  });
});