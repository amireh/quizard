define([ 'ext/pixy' ], function(Pixy) {
  var Course = Pixy.Model.extend({
    name: 'Course',
    urlRoot: '/courses',

    toProps: function() {
      return {
        id: this.get('id') + '',
        name: this.get('name')
      };
    }
  });

  return Course;
});