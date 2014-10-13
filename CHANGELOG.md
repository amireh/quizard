## 14/10/2014 [1.1.9]

- Switched to [Webpack]() for development and building
- Set up an architecture for decoupling recipes from the "base" app; paving the way for more recipes that aren't scoped to quizzes only
    + Recipes are bundled (or "chunks" in webpack terms)
    + Recipes are totally lazily-loaded! This includes literally everything: routes, route-registration, models, views, etc.
- A new special file `/available_recipes.json` which has a listing of the available recipes in the app; this may change to either be automatically generated at build time, or to allow the user to choose which recipes they'd like to enable