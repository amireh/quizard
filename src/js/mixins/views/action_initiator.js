define([ 'underscore' ], function(_) {
  var clone = _.clone;

  return {
    getInitialState: function() {
      return {
        actionIndex: undefined
      };
    },

    getDefaultProps: function() {
      return {
        storeError: undefined
      };
    },

    componentDidMount: function() {
      if (typeof this.onStoreError !== 'function') {
        throw "Component must define an #onStoreError function to use ActionInitiatorMixin.";
      }
    },

    componentWillReceiveProps: function(nextProps) {
      var storeError = nextProps.storeError;

      if (storeError && storeError.actionIndex === this.state.actionIndex) {
        this.onStoreError(storeError);
        this.setState({
          storeError: clone(storeError)
        });
      }
    },

    clearStoreError: function() {
      this.setState({ storeError: undefined });
    },

    trackAction: function(service) {
      var actionIndex;

      if (typeof service === 'object') {
        actionIndex = service.actionIndex;
      }
      else if (typeof service === 'number') {
        actionIndex = service;
      }
      else {
        console.warn(
          'ActionInitiatorMixin: unable to extract actionIndex from',
          'service object:', service);
        return;
      }

      this.setState({
        actionIndex: actionIndex
      });
    }
  };
});