module.exports = {
  transpile: {
    // main: {
      type: "amd", // or "amd" or "yui"
      files: [{
        expand: true,
        cwd: './',
        src: [ 'tmp/compiled/jsx/**/*.hm.js' ],
        dest: 'tmp/compiled/amd',
        ext: '.amd.js',
      }],
      compatFix: true,
      moduleName: function(name) {
        console.log('#moduleName:', arguments);
        return name.replace(/\.hm$/, '').replace(/^\//, '');
      }
    // }
  }
};