/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var TooltipsMixin = require('mixins/views/tooltips');
  var HasAnswersMixin = require('jsx!./has_answers_mixin');

  var MultipleChoice = React.createClass({
    mixins: [ React.addons.LinkedStateMixin, TooltipsMixin, HasAnswersMixin ],

    render: function() {
      return this.renderAnswerSets();
    }
  });

  return MultipleChoice;
});