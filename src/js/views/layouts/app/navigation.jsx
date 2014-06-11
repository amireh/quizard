/** @jsx React.DOM */
define([ 'react', 'constants' ], function(React, K) {
  /**
   * @internal
   *
   * The [href] attribute of the active .navbar-link.
   *
   * See constants/navigation.js
   */
  var activeLink;

  /**
   * @internal Test if a link is currently active.
   */
  var isActive = function(href) {
    return href === activeLink;
  };

  var Link = React.createClass({
    render: function() {
      var klasses = {
        'navbar-link': true,
        'active': isActive(this.props.href)
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

  var Navigation = React.createClass({
    getDefaultProps: function() {
      return {
        active: undefined
      };
    },

    render: function() {
      var linksClassName = React.addons.classSet({
        'navbar-links': true,
        'disabled': !this.props.authenticated
      });

      activeLink = this.props.active;

      return(
        <nav id="navbar">
          <section className={linksClassName}>
            <Link icon="icon-home" href="/">Home</Link>

            <h4 className="navbar-heading">
              Recipes
            </h4>

            <Link icon="icon-android" href={K.RECIPE_ENROLL_STUDENTS}>
              Enroll students
            </Link>

            <Link icon="icon-wand" href={K.RECIPE_TAKE_QUIZ}>
              Take a quiz
            </Link>
          </section>

          <section className="navbar-actions">
            {this.props.authenticated &&
              <a href="/logout">Logout</a>
            }
            {!this.props.authenticated &&
              <a className="btn btn-primary" href="/login">Login</a>
            }
          </section>
        </nav>
      );
    }
  });

  return Navigation;
});