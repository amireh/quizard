define(function(require) {
  var Pixy = require('pixy');
  var K = require('constants');
  var Operation = require('models/operation');
  var operation;
  var store;
  var minimized = true;

  store = new Pixy.Store('operationStore', {
    start: function(name, description) {
      if (operation && operation.isActive()) {
        operation.markAborted();
      }

      this.stopListening();
      minimized = false;

      operation = new Operation(name, description);
      this.listenTo(operation, 'change', this.emitChange);

      this.emitChange();

      return operation;
    },

    toProps: function() {
      var props = {};

      if (operation) {
        props = operation.toProps();
      }

      props.minimized = minimized;

      return props;
    },

    onAction: function(action, payload, onChange/*, onError*/) {
      if (action === K.OPERATION_BOX_MINIMIZE) {
        minimized = true;
        onChange();
      }
      else if (action === K.OPERATION_BOX_RESTORE) {
        minimized = false;
        onChange();
      }
      else if (action === K.OPERATION_ABORT) {
        if (operation) {
          operation.markAborted();
        }
      }
    }
  });

  return store;
});