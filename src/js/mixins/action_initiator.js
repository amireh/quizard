define([], function() {
  return {
    getInitialState: function() {
      return {
        actionIndex: null
      };
    },

    getDefaultProps: function() {
      return {
        storeError: null
      };
    },

    componentDidMount: function() {
      if (typeof this.onStoreError !== 'function') {
        throw "Component must define an #onStoreError function to use ActionInitiatorMixin.";
      }
    },

    componentDidUpdate: function() {
      var storeError = this.props.storeError;

      if (storeError && storeError.actionIndex === this.state.actionIndex) {
        this.onStoreError(storeError);
      }
    }
  }
});