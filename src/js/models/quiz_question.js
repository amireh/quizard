define([ 'ext/pixy' ], function(Pixy) {

  /**
   * @class Models.Quiz
   *
   * The Admin or one of them students.
   */
  return Pixy.Model.extend({
    name: 'QuizQuestion',

    urlRoot: function() {
      return this.collection.url(true);
    },

    toProps: function() {
      var props = {};

      props.id = this.get('id') + '';
      props.type = this.get('question_type');

      return props;
    }
  });
});