define([ 'core/dispatcher', 'constants', 'pixy' ],
function(Dispatcher, K, Pixy) {
  return {
    closeDialog: function() {
      Pixy.routeMap.root.trigger('remove', dialog, 'dialogs');
    }
  };
});