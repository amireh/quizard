define(function(require) {
  var Pixy = require('pixy');
  var Model = Pixy.Model;

  /**
   * @class Models.Quiz
   */
  return Model.extend({
    name: 'Quiz',

    urlRoot: function() {
      return this.collection.url(true);
    },

    parse: function(payload) {
      if (payload.title) {
        payload.name = payload.title;
        delete payload.title;
      }

      return payload;
    },

    toProps: function() {
      var props = {};

      props.id = this.get('id') + '';
      props.name = this.get('name');
      props.url = this.url();

      return props;
    }
  });
});