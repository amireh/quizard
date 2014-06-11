define([ 'ext/pixy' ], function(Pixy) {

  /**
   * @class Models.Quiz
   *
   * The Admin or one of them students.
   */
  return Pixy.Model.extend({
    name: 'Quiz',

    urlRoot: function() {
      return this.collection.url(true);
    },

    toProps: function() {
      var props = {};

      props.id = this.get('id') + '';
      props.name = this.get('title');

      return props;
    }
  });
});