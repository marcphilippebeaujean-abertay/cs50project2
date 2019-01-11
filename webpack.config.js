const path = require('path');

module.exports = {
  entry: ['babel-polyfill', './static/js/index.js'],
  output: {
      path: path.resolve(__dirname, 'static/dist'),
      filename: "js/bundle.js"
  },
  devServer: {
      contentBase: './static/dist'
  },
  module: {
      rules: [
          {
              test: /\.js$/,
              exclude: /node_modules/,
              use: {
                  loader: 'babel-loader'
              }
          }
      ]
  }
};