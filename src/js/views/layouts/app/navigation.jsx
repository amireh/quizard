/** @jsx React.DOM */
define([
  'react',
  'jsx!./navigation/account_picker',
  'jsx!./navigation/course_picker'
], function(React, AccountPicker, CoursePicker) {
  /**
   * @internal
   *
   * The [href] attribute of the active .navbar-link.
   *
   * See constants/navigation.js
   */
  var activeLink;

  /**
   * @internal
   *
   * The [href] attribute of the active .navbar-subnav link
   *
   * This will only make sense if activeLink is set.
   */
  var activeChild;

  /**
   * @internal Test if a link is currently active.
   */
  var isActive = function(href, isChild) {
    return href === (isChild ? activeChild : activeLink);
  };

  var Link = React.createClass({
    render: function() {
      var klasses = {
        'navbar-link': !this.props.isChild,
        'active': isActive(this.props.href, this.props.isChild)
      };

      if (this.props.icon) {
        klasses[this.props.icon] = true;
      }

      return (
        <a className={React.addons.classSet(klasses)} href={this.props.href}>
          {this.props.children}
        </a>
      );
    }
  });

  var SubNav = React.createClass({
    render: function() {
      var style = {};

      // if (!isActive(this.props.for)) {
      //   style.display = 'none';
      // }

      return (
        <ul className="navbar-subnav" style={style}>
          {this.props.children}
        </ul>
      );
    }
  });

  var SubLink = React.createClass({
    render: function() {
      return (
        <li>
          <Link href={this.props.href} isChild={true}>{this.props.children}</Link>
        </li>
      );
    }
  });

  var Navigation = React.createClass({
    getDefaultProps: function() {
      return {
        active: undefined,
        activeChild: undefined
      };
    },

    render: function() {
      activeLink = this.props.active;
      activeChild = this.props.activeChild;

      return(
        <nav id="navbar">
          <AccountPicker
            accounts={this.props.accounts}
            activeAccountId={this.props.activeAccountId} />
          <CoursePicker
            courses={this.props.courses}
            activeCourseId={this.props.activeCourseId} />

          <Link icon="icon-android" href="/app/users">Users</Link>
          <SubNav for="/app/users">
            <SubLink href="/app/users/list">
              View users
            </SubLink>

            <SubLink href="/app/users/enroll">
              Enroll a student
            </SubLink>
          </SubNav>

          <Link icon="icon-wand" href="/app/quizzes">
            Quizzes
          </Link>
        </nav>
      );
    }
  });

  return Navigation;
});