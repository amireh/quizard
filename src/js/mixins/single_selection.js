/** @jsx React.DOM */
define([ 'react', 'underscore' ], function(React, _) {
  function getInitialSelection(props) {
    return React.LinkUtils.getValue(props);
  }

  /**
   * React utilities for serializing the state of radio buttons.
   *
   * Usage example:
   *
   *    ```javascript
   *    React.createClass({
   *      mixins: [ SingleSelection ],
   *
   *      render: function() {
   *        return (
   *          <div>
   *            {this.props.items.map(this.renderItem)};
   *          </div>
   *        );
   *      },
   *
   *      renderItem: function(item) {
   *        return React.DOM.input({
   *          value: item.id,
   *          isChecked: this.props.isChecked(this),
   *          onChange: this.onChange
   *        });
   *      }
   *    });
   *    ```
   */
  return {
    propTypes: {
      initialSelection: React.PropTypes.string
    },

    getInitialState: function() {
      return {
        selection: getInitialSelection(this.props)
      };
    },

    componentWillReceiveProps: function(nextProps) {
      // console.debug('\tInitial selection has changed:',
      //   getInitialSelection(this.props), '=>',
      //   getInitialSelection(nextProps),
      //   '... resetting.');

      this.setState({
        selection: getInitialSelection(nextProps)
      });
    },

    /**
     * Selection handler. This needs to be bound to each <input />.
     *
     * If you need a hook for each time the selection changes, define a
     * "onSelectionChanged" method and it will be called with the new selection.
     *
     * @param  {Event} e
     */
    onChange: function(e) {
      var id = e.target.value;

      console.debug('Single selection changed from:', this.state.selection, '=>', id);

      this.setState({ selection: id });

      if (this.onSelectionChange) {
        this.onSelectionChange(id);
      }
    },

    /**
     * Use this to define the [checked] attribute on your element. E.g:
     *
     *   ```javascript
     *   renderItem: function(item) {
     *     return <input type="radio" checked={this.isChecked(item.id)} />;
     *   }
     *   ```
     *
     * @param  {String}  id
     *         ID of the item you're testing.
     *
     * @return {Boolean}
     *         Whether the item identified by the given ID is what's currently
     *         selected.
     */
    isChecked: function(id) {
      return this.state.selection === id;
    }
  };
});