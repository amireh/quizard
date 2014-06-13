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

  /**
   * @class Components.CoursePicker
   */
  var CoursePicker = React.createClass({
    mixins: [ React.addons.LinkedStateMixin ],
    propTypes: {
      courses: React.PropTypes.arrayOf(React.PropTypes.shape({
        id: React.PropTypes.string,
        name: React.PropTypes.string
      }))
    },

    getInitialState: function() {
      return {
        courseId: null
      };
    },

    getDefaultProps: function() {
      return {
        courses: [],
        activeCourseId: null
      };
    },

    render: function() {
      return (
        <Chosen
          synchronize
          className="with-arrow"
          chosenOptions={chosenOptions}
          value={this.props.activeCourseId}
          onChange={this.activateCourse}
          children={this.props.courses.map(this.renderCourse)} />
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