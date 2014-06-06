define([ 'stores/sessions', 'rsvp', 'constants' ],
function(SessionStore, RSVP, K) {
  function logTransition(transition) {
    return [ transition.intent.url, transition.targetName ].join(' => ');
  }

  return {
    beforeModel: function(transition) {
      var isAuthenticated = SessionStore.isActive();

      switch (this.accessPolicy) {
        case 'public':
          console.info('Ensuring public access policy.');

          if (isAuthenticated) {
            console.warn('Over-privileged access to:', logTransition(transition));

            return RSVP.reject(K.ERROR_ACCESS_OVERAUTHORIZED);
          }
        break;

        case 'private':
          console.info('Ensuring private access policy.');

          if (!isAuthenticated) {
            console.warn('Unprivileged access to:', logTransition(transition));

            return RSVP.reject(K.ERROR_ACCESS_UNAUTHORIZED);
          }
        break;
        default:
      }
    }
  };
});