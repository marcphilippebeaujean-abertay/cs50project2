const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractPlugin = new ExtractTextPlugin({
    filename: 'style.css'
})

module.exports = {
  entry: ['babel-polyfill', './static/js/index.js'],
  output: {
      path: path.resolve(__dirname, 'static/dist'),
      filename: "bundle.js"
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
          },
          {
              test: /\.scss$/,
              use: extractPlugin.extract({
                  use: [
                      'css-loader',
                      'sass-loader'
                  ]
              })
          }
      ]
  },
  plugins: [
      extractPlugin
  ]
};