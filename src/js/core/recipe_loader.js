var Promise = require('./promise');
var RecipeLoaders = require('../bundles/recipes');
var Pixy = require('pixy');
var findBy = require('lodash').findWhere;
var ApplicationRouter = Pixy.ApplicationRouter;
var AppActions = require('actions/app');

var BlankRoute = new Pixy.Route('blankRecipeRoute', {
  enter: function() {
    console.warn('>> BLANK ROUTE ENTERED');
  }
});

var getLoader = function(name) {
  var loader = findBy(RecipeLoaders, { name: name });

  if (!loader) {
    throw new Error(
      "Recipe " + name + " could not be found. " +
      "Did you register it in the available_recipes.json file?"
    );
  }

  return loader;
};

var loadRecipe = function(name) {
  var loader = getLoader(name);

  return new Promise(function(resolve, reject) {
    try {
      loader.load(function(recipe) {
        if (!loader._loaded) {
          AppActions.markLoading();

          ApplicationRouter.map(function(match) {
            match('/').to('root', function(match) {
              match('/recipes/' + name).to('takeQuizRecipe', function(match) {
                // The "/" route must be defined for other sibling/nested routes
                // to function, and it can be re-defined by the actual recipe
                // route map so it's ok:
                match('/').to('blankRecipeRoute');

                recipe.setup(match);
              });
            });
          });

          loader._loaded = true;
        }

        setTimeout(function() { // for loading fancies
          AppActions.unmarkLoading();
          resolve(recipe);
        }, 2500);
      });
    } catch(error) {
      reject(error);
    }
  });
};

var isLoaded = function(name) {
  var loader = getLoader(name);

  return !!loader._loaded;
};

module.exports = {
  load: loadRecipe,
  isLoaded: isLoaded,
  hasRecipe: function(name) {
    try { return !!getLoader(name); } catch(e) { return false; }
  }
};