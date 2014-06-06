module.exports = {
  react: {
    options: {
      // ignoreMTime: true
    },
    files: [{
      expand: true,
      cwd: 'src/js',
      src: [ '**/*.jsx' ],
      dest: 'tmp/compiled/jsx',
      // Rename all files to end with .js; source can be .jsx, or .hm.jsx
      rename: function (dest, src) {
        var folder    = src.substring(0, src.lastIndexOf('/'));
        var filename  = src.substring(src.lastIndexOf('/'), src.length);
        var extIndex = filename.lastIndexOf('.');
        var extension;

        extension = filename.substring(extIndex+1, filename.length);
        filename  = filename.substring(0, extIndex);

        return dest +'/' + folder + filename + '.' + extension.replace(/jsx/, 'js');
      }
    }]
  }
};