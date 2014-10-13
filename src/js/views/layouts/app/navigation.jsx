/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var K = require('constants');
  var OperationActions = require('actions/operations');
  var RouteActions = require('actions/routes');

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
        <a
          onClick={this.props.onClick}
          className={React.addons.classSet(klasses)} href={this.props.href}>
          {this.props.children}
        </a>
      );
    }
  });

  var Navigation = React.createClass({
    getDefaultProps: function() {
      return {
        active: undefined,
        operation: {}
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
              Preparation
            </h4>

            <Link icon="icon-android" href={K.RECIPE_ENROLL_STUDENTS}>
              Enroll students
            </Link>

            <Link icon="icon-search" href={K.RECIPE_LOAD_STUDENTS}>
              Load students
            </Link>

            <h4 className="navbar-heading">
              Recipes
            </h4>

            <Link icon="icon-wand" href={K.RECIPE_TAKE_QUIZ}>
              Take a quiz
            </Link>
          </section>

          <section className="navbar-actions">
            {this.props.authenticated ?
              <a className="btn btn-default" href="/logout">Logout</a> :
              <a className="btn btn-primary" href="/login">Login</a>
            }

            <div className="btn-group pull-right">
              <button
                className="btn btn-default icon-console"
                onClick={this.toggleOperation}
                disabled={!this.props.operation.name || !this.props.operation.minimized}
                title="Restore the operation progress box" />

              <button
                className="btn btn-default icon-cog"
                onClick={this.goToSettings}
                title="Configure Quizard" />
            </div>
          </section>
        </nav>
      );
    },

    toggleOperation: function(e) {
      e.preventDefault();
      OperationActions.restore();
    },

    goToSettings: function(e) {
      e.preventDefault();
      RouteActions.goToSettings();
    }
  });

  return Navigation;
});