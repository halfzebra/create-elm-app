const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');

const paths = require('../config/paths');
const baseConfig = require('./webpack.config.base');

module.exports = merge(baseConfig, {

  devtool: 'eval',

  entry: [
    // WebpackDevServer client.
    require.resolve('webpack-dev-server/client') + '?/',

    // Replacement runtime.
    require.resolve('webpack/hot/dev-server'),

    paths.entry
  ],
  output: {
    pathinfo: true,

    // Generated JS files.
    filename: 'dist/js/bundle.js',

    publicPath: '/'
  },
  module: {
    loaders: [
      {
        test: /\.elm$/,
        exclude: [ /elm-stuff/, /node_modules/ ],
        loader: 'elm-hot!elm-webpack?verbose=true&warn=true&pathToMake=' + paths.elmMake
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.template,
      favicon: paths.favicon
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
});
