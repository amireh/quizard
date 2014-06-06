define([
  'pixy/ext/react',
  './react/link_utils',
  'mixins/action_initiator',
  'mixins/form_errors'
 ],
function(React, LinkUtils, ActionInitiatorMixin, FormErrorsMixin) {
  React.mixins = {};
  React.mixins.ActionInitiator = ActionInitiatorMixin;
  React.mixins.FormErrors = FormErrorsMixin;

  React.LinkUtils = LinkUtils;

  return React;
});