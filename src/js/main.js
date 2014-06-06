requirejs.config({
  baseUrl: '../src/js',
  paths: {
    'text': '../../vendor/js/require/text',
    'jsx': '../../vendor/js/require/jsx',
    'JSXTransformer': '../../vendor/js/require/JSXTransformer-0.10.0',
    'jquery': '../../vendor/js/jquery/jquery-2.0.2',
    'jquery.jquerypp': '../../vendor/js/jquery/jquerypp.custom',
    'jquery.qtip': '../../vendor/js/jquery/qtip-custom-2.2.0/jquery.qtip',
    'chosen': '../../vendor/js/chosen',
    'react': '../../vendor/js/react-0.10.0',
    'store': '../../vendor/js/store',
    'underscore': '../../vendor/js/lodash/lodash.custom',
    'lodash': '../../vendor/js/lodash/lodash.custom',
    'pikaday': '../../vendor/js/pikaday',
    'shortcut': '../../vendor/js/shortcut',
    'inflection': '../../vendor/js/inflection',
    'moment': '../../vendor/js/moment.min',
    'humane': '../../vendor/js/humane',
    'pixy': '../../vendor/js/pixy',
    'rsvp': '../../vendor/js/pixy',
    'router': '../../vendor/js/pixy',
  },

  shim: {
    'jquery':                 { exports: 'jQuery' },
    'jquery.jquerypp':        [ 'jquery' ],
    'jquery.qtip':            [ 'jquery' ],

    'chosen': {
      deps: [ 'jquery' ],
      exports: 'Chosen'
    },

    'underscore':     { exports: '_' },
    'lodash':         { exports: '_' },
    'store':          { exports: 'store' },
    'shortcut':       { exports: 'shortcut' },
    'moment':         { exports: 'moment' },
    'inflection':     [],
    'pikaday': { exports: 'Pikaday', deps: [ 'underscore', 'moment' ] },
  },

  jsx: {
    fileExtension: '.jsx'
  }
});

require([ 'boot' ]);