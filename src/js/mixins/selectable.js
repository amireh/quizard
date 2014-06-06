/** @jsx React.DOM */
define([ 'react', 'underscore' ], function(React, _) {
  var clone = _.clone;
  var contains = _.contains;

  function getInitialSelection(props, dontClone) {
    var selection = React.LinkUtils.getValue(props);
    return dontClone ? selection : clone(selection);
  }

  return {
    propTypes: {
      value: React.PropTypes.arrayOf(React.PropTypes.string)
    },

    getInitialState: function() {
      return {
        selection: getInitialSelection(this.props)
      };
    },

    getDefaultProps: function() {
      return {
      };
    },

    componentWillReceiveProps: function(nextProps) {
      var current = getInitialSelection(this.props, true);
      var next = getInitialSelection(nextProps, true);

      if (!_.isEqual(current, next)) {
        console.info("Selection has changed:", current, '=>', next);

        this.setState({
          selection: getInitialSelection(nextProps)
        });
      }
    },

    onChange: function(e) {
      var selection = this.state.selection || [];
      var id = e.target.value;
      var isChecked = e.target.checked;
      var index = selection.indexOf(id);
      var wasChecked = index > -1;

      if (isChecked && !wasChecked) {
        selection.push(id);
      }
      else if (!isChecked && wasChecked) {
        selection.splice(index, 1);
      }

      console.debug(this.type.displayName,
        ': changing selection for item "' + id + '"',
        wasChecked, '=>', isChecked, '[ in:', selection, ']');

      this.setState({
        selection: selection
      });

      if (this.onSelectionChange) {
        this.onSelectionChange(selection);
      }
    },

    isChecked: function(id) {
      return contains(this.state.selection, id);
    }
  };
});