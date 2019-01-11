const path = require('path');

module.exports = {
  entry: './static/js/index.js',
  output: {
      path: path.resolve(__dirname, 'static/dist'),
      filename: "js/bundle.js"
  },
    devServer: {
      contentBase: './static/dist'
    }
};