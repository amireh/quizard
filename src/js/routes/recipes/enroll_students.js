define([
  'routes/base',
  'constants',
  'jsx!views/users/enroll'
], function(Route, K, View) {
  new Route('enrollStudentsRecipe', {
    views: [{ component: View }],
    navLink: K.RECIPE_ENROLL_STUDENTS
  });
});