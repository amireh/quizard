module.exports = {
  options: {
    strictImports: false
  },
  production: {
    options: {
      paths: [ 'src/css' ],
      compress: false
    },
    files: {
      'www/dist/quizard.css': 'src/css/app.less'
    }
  }
};