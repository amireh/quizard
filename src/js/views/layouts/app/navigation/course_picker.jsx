/** @jsx React.DOM */
define([
  'react',
  'ext/underscore',
  'actions/courses',
  'jsx!components/dropdown'
],
function(React, _, CourseActions, Dropdown) {
  var DropdownToggle = Dropdown.Toggle;
  var DropdownMenu = Dropdown.Menu;
  var findBy = _.findBy;

  /**
   * @class Components.CoursePicker
   */
  var CoursePicker = React.createClass({
    mixins: [],
    propTypes: {
      courses: React.PropTypes.arrayOf(React.PropTypes.shape({
        id: React.PropTypes.string,
        name: React.PropTypes.string
      }))
    },

    getDefaultProps: function() {
      return {
        courses: [],
        courses: [],
        activeCourseId: null
      };
    },

    render: function() {
      var activeCourse = findBy(this.props.courses, {
        id: this.props.activeCourseId
      }) || { name: 'Choose a course' };

      return (
        <div className="course-picker">
          <Dropdown sticky={true}>
            <DropdownToggle className="btn btn-default btn-dropdown btn-block">
              <div className="heading sticky">
                <span className="add-on btn-dropdown-anchor icon-arrow-down" />
                <span className="active-course">{activeCourse.name}</span>
              </div>
            </DropdownToggle>

            <DropdownMenu tagName="ul" className="list-view sticky">
              {this.props.courses.map(this.renderCourse)}
            </DropdownMenu>
          </Dropdown>
        </div>
      );
    },

    renderCourse: function(course) {
      return (
        <li
          onClick={this.activateCourse.bind(null, course.id)}
          key={course.id}
          className="list-item">
          <span className="btn-link">{course.name}</span>
        </li>
      );
    },

    activateCourse: function(id) {
      CourseActions.activate(id);
    }
  });

  return CoursePicker;
});