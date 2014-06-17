/** @jsx React.DOM */
define([
  'react',
  'ext/underscore',
  'actions/courses',
  'jsx!components/chosen'
],
function(React, _, CourseActions, Chosen) {
  var chosenOptions = {
    width: '100%'
  };
  var NO_COURSE_ID = 'none';
  var NO_COURSE = [{
    id: NO_COURSE_ID,
    name: 'Choose a course'
  }];

  /**
   * @class Components.CoursePicker
   */
  var CoursePicker = React.createClass({
    propTypes: {
      courses: React.PropTypes.arrayOf(React.PropTypes.shape({
        id: React.PropTypes.string,
        name: React.PropTypes.string
      }))
    },

    getDefaultProps: function() {
      return {
        courses: [],
        activeCourseId: NO_COURSE_ID
      };
    },

    render: function() {
      var courses = this.props.activeCourseId === NO_COURSE_ID ?
        NO_COURSE.concat(this.props.courses) :
        this.props.courses;

      return (
        <Chosen
          synchronize
          className="with-arrow"
          chosenOptions={chosenOptions}
          value={this.props.activeCourseId}
          onChange={this.activateCourse}
          children={courses.map(this.renderCourse)} />
      );
    },

    renderCourse: function(course) {
      return (
        <option key={course.id} value={course.id}>
          {course.name}
        </option>
      );
    },

    activateCourse: function(e) {
      CourseActions.activate(e.target.value);
    }
  });

  return CoursePicker;
});