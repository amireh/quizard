module.exports = {
  locales: {
    options: {
      ignored: /^_/,
      space: 2,
      customTypes: {
        '!include scalar': function(value, yamlLoader) {
          return yamlLoader(value);
        },
        '!max sequence': function(values) {
          return Math.max.apply(null, values);
        },
        '!extend mapping': function(value, yamlLoader) {
          return _.extend(yamlLoader(value.basePath), value.partial);
        }
      }
    },
    files: {
      'www/assets/locales/en.json': [ 'config/locales/en.yml' ]
    }
  },
};