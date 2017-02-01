const autoprefixer = require('autoprefixer');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const paths = require('../config/paths');
const getClientEnvironment = require('./env');

module.exports = {

  devtool: 'eval',

  entry: [

    // WebpackDevServer client.
    require.resolve('react-dev-utils/webpackHotDevClient'),

    // Replacement runtime.
    require.resolve('webpack/hot/dev-server'),

    paths.entry
  ],
  output: {

    pathinfo: true,

    // The build folder.
    path: paths.dist,

    // Generated JS files.
    filename: 'dist/js/bundle.js',

    publicPath: '/'
  },
  resolveLoader: {

    // Look for loaders in own node_modules
    modules: [ paths.ownModules ],
    moduleExtensions: [ '-loader' ]
  },
  resolve: {
    modules: [ 'node_modules' ],
    extensions: [ '.js', '.elm' ]
  },
  module: {
    noParse: /\.elm$/,
    rules: [
      {
        test: /\.elm$/,
        exclude: [ /elm-stuff/, /node_modules/ ],
        use: [
          {loader: 'elm-hot-loader'},
          {
            loader: 'elm-webpack-loader',
            options: {
              verbose: true,
              warn: true,
              debug: true,
              pathToMake: paths.elmMake
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          {loader: 'style-loader'},
          {loader: 'css-loader'},
          {loader: 'postcss-loader'}
        ]
      },
      {
        exclude: [
          /\.html$/,
          /\.js$/,
          /\.css$/,
          /\.json$/,
          /\.svg$/
        ],
        loader: 'url',
        options: {
          limit: 10000,
          name: 'static/media/[name].[hash:8].[ext]'
        }
      },
      // "file" loader for svg
      {
        test: /\.svg$/,
        loader: 'file-loader',
        options: {
          name: 'static/media/[name].[hash:8].[ext]'
        }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin(getClientEnvironment()),
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.template,
      favicon: paths.favicon
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: [
          autoprefixer({
            browsers: [
              '>1%',
              'last 4 versions',
              'Firefox ESR',
              'not ie < 9'
            ]
          })
        ]
      }
    }),
  ]
};
