module.exports = {
  options: {
    strictImports: true
  },
  production: {
    options: {
      paths: [ 'src/css' ],
      compress: true
    },
    files: {
      'www/dist/quizard.css': 'src/css/app.less'
    }
  }
};