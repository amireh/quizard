var rewriteRulesSnippet = require('grunt-connect-rewrite/lib/utils').rewriteRequest;
var proxy = require('grunt-connect-proxy/lib/utils').proxyRequest;

module.exports = {
  rules: [
    {from: '^/en/(.*)$', to: '/#/en/$1'}
  ],

  www: {
    proxies: [{
      context: '/api/v1',
      host: 'localhost',
      port: 3000,
      https: false,
      changeOrigin: false,
      xforward: false,
      // rewrite: {
      //   '^/api/v1': '',
      // }
    }],

    options: {
      keepalive: true,
      port: 8001,
      base: 'www',
      middleware: function (connect, options) {
        var middlewares = [];
        var directory;

        // ReverseProxy support
        middlewares.push( proxy );

        // RewriteRules support
        middlewares.push(rewriteRulesSnippet);

        if (!Array.isArray(options.base)) {
          options.base = [options.base];
        }

        // Serve static files.
        options.base.forEach(function (base) {
          middlewares.push(connect.static(base));
        });

        // Make directory browse-able.
        directory = options.directory || options.base[options.base.length - 1];
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
