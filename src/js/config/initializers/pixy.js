define([
  'ext/pixy',
  'store'
], function(Pixy, Store) {
  'use strict';

  // Install Cache storage adapter
  Pixy.Cache.setAdapter(Store);
  Pixy.Cache.setAvailable(Store.enabled);

  Pixy.Registry.options.mute = true;
});