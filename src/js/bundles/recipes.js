var recipeLoaders = [];
var availableRecipes = require('available_recipes.json');

console.log('Recipes available:', availableRecipes);

recipeLoaders = availableRecipes.reduce(function(set, name) {
  return set.concat({
    name: name,
    load: require('bundle?lazy!recipes/'+name+'/main.js')
  });
}, []);

module.exports = recipeLoaders;
