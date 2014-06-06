define([], function() {
  function canTrigger(transition) {
    return !!transition.router.currentHandlerInfos;
  }

  return {
    beforeModel: function(transition) {
      if (!canTrigger(transition)) {
        return;
      }

      this.trigger('loading', true);
      console.info('Loading');
    },
    afterModel: function(model, transition) {
      if (!canTrigger(transition)) {
        return;
      }

      console.info('Hiding loading status.');
      this.trigger('loading', false);
    }
  };
});