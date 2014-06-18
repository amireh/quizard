define([ 'pixy' ], function(Pixy) {
  var Course = Pixy.Model.extend({
    name: 'Course',

    toProps: function() {
      return {
        id: this.get('id') + '',
        name: this.get('name')
      };
    }
  });

  return Course;
});