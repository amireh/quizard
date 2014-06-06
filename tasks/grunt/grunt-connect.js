var rewriteRulesSnippet = require('grunt-connect-rewrite/lib/utils').rewriteRequest;

module.exports = {
  rules: [
    {from: '^/en/(.*)$', to: '/#/en/$1'}
  ],
  www: {
    options: {
      keepalive: true,
      port: 8000,
      base: 'www',
      middleware: function (connect, options) {
        var middlewares = [];

        // RewriteRules support
        middlewares.push(rewriteRulesSnippet);

        if (!Array.isArray(options.base)) {
          options.base = [options.base];
        }

        var directory = options.directory || options.base[options.base.length - 1];
        options.base.forEach(function (base) {
          // Serve static files.
          middlewares.push(connect.static(base));
        });

        // Make directory browse-able.
        middlewares.push(connect.directory(directory));

        return middlewares;
      }
    }
  },

  tests: {
    options: {
      keepalive: false,
      port: 8003,
      hostname: '*'
    }
  },

  docs: {
    options: {
      keepalive: true,
      port: 8001,
      base: "doc"
    }
  },

  browser_tests: {
    options: {
      keepalive: true,
      port: 8002
    }
  }
};
