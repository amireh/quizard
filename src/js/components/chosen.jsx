/** @jsx React.DOM */
define([ 'ext/react', 'ext/jquery', 'underscore' ], function(React, $, _) {
  var LinkUtils = React.LinkUtils;
  var extend = _.extend;
  var chosenDefaults = {
    inherit_select_classes: true,
    disable_search: true
  };
  var updateChosen = function($select) {
    $select.trigger('chosen:updated');
  };
  var destroyChosen = function($select) {
    $select.chosen('destroy');
  };

  /**
   * @class Components.Chosen
   *
   * Wrap a `<select />` with a Chosen.
   */
  var Chosen = React.createClass({
    propTypes: {
      children: React.PropTypes.arrayOf(React.PropTypes.component).isRequired,

      /**
       * @config {Object} [chosenOptions={}]
       *
       * Chosen options.
       */
      chosenOptions: React.PropTypes.object,

      /**
       * @config {Boolean} [synchronize=true]
       *
       * Turn this on if you don't want Chosen to update itself as soon as the
       * user changes the selection (e.g, you want the flow to update it
       * instead.)
       */
      synchronize: React.PropTypes.bool
    },

    getDefaultProps: function() {
      return {
        width: '100px',
        synchronize: true,
        chosenOptions: {
        }
      };
    },

    componentDidMount: function() {
      var $select, options;

      options = extend({}, chosenDefaults, {
        width: this.props.width
      }, this.props.chosenOptions);

      $select = $(this.refs.select.getDOMNode());
      $select.on('change', LinkUtils.getChangeHandler(this.props));

      if (this.props.synchronize) {
        $select.on('change', this._synchronizeChosen);
      }

      $select.chosen(options);

      if (options.minWidth) {
        $select.data('chosen').container.css({
          minWidth: options.minWidth
        });
      }
    },

    componentWillUnmount: function() {
      destroyChosen($(this.refs.select.getDOMNode()));
    },

    componentDidUpdate: function() {
      updateChosen($(this.refs.select.getDOMNode()));
    },

    render: function() {
      return this.transferPropsTo(React.DOM.select({
        ref: 'select'
      }, this.props.children));
    },

    _synchronizeChosen: function() {
      var select;

      select = this.refs.select.getDOMNode();
      select.value = LinkUtils.getValue(this.props);

      updateChosen($(this.refs.select.getDOMNode()));
    }
  });

  return Chosen;
});