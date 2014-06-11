define([ 'ext/pixy' ], function(Pixy) {
  var ManualGradingQuestions = [
    'essay_question',
    'file_upload_question'
  ];

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
      var props = this.pick([
        'answers', 'matches', 'formulas', 'variables', 'position'
      ]);

      props.id = this.get('id') + '';
      props.type = this.get('question_type');
      props.text = this.get('question_text');
      props.pointsPossible = this.get('points_possible');
      props.autoGradable = ManualGradingQuestions.indexOf(props.type) === -1;

      return props;
    }
  });
});