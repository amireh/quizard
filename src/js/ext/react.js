define([
  'pixy',
  'react',
  './react/link_utils',
  'mixins/views/action_initiator',
  'mixins/views/form_errors'
 ],
function(Pixy, React, LinkUtils, ActionInitiatorMixin, FormErrorsMixin) {
  React.mixins = {};
  React.mixins.ActionInitiator = ActionInitiatorMixin;
  React.mixins.FormErrors = FormErrorsMixin;

  React.LinkUtils = LinkUtils;

  return React;
});