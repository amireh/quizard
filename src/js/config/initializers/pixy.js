var Pixy = require('pixy');
var ajax = require('ext/jquery/ajax');
var Config = require('config');
var SessionStore = require('stores/sessions');
var K = require('constants');
var Store = require('vendor/js/store');
var Promise = require('core/promise');
var RecipeLoader = require('core/recipe_loader');

Pixy.ajax = ajax({
  host: Config.apiHost,
  timeout: Config.xhr.timeout
});

Pixy.configure({
  isAuthenticated: function() {
    return SessionStore.isActive();
  },

  getCurrentLayoutName: function() {
    return 'appLayout';
  },

  getDefaultWindowTitle: function() {
    return 'Quizard - Canvas Quiz Hax';
  },

  loadRoute: function(url, onLoad) {
    var recipeCapture = url.match(/^\/recipes\/([^\/]+)/);
    var recipeName;

    if (recipeCapture) {
      recipeName = recipeCapture[1];

      if (RecipeLoader.hasRecipe(recipeName) && !RecipeLoader.isLoaded(recipeName)) {
        console.debug('Loading recipe %s', recipeName);

        return RecipeLoader.load(recipeName).then(function(recipe) {
          console.debug('\tRecipe has been loaded. Resuming transition...');
          onLoad();
        });
      }
    }

    onLoad();
  }
});

// Install Cache storage adapter
Pixy.Cache.setAdapter(Store);
Pixy.Cache.setAvailable(Store.enabled);
Pixy.Cache.enable();

Pixy.Collection.setDefaultOptions('add', { parse: true });
Pixy.Collection.setDefaultOptions('set', { parse: true });

Pixy.Registry.options.mute = true;

window.Pixy = Pixy;