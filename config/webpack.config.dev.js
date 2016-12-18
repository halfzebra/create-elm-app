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
    root: paths.ownModules,
    moduleTemplates: [ '*-loader' ]
  },
  resolve: {
    modulesDirectories: [ 'node_modules' ],
    extensions: [ '', '.js', '.elm' ]
  },
  module: {
    noParse: /\.elm$/,
    loaders: [
      {
        test: /\.elm$/,
        exclude: [ /elm-stuff/, /node_modules/ ],
        loader: 'elm-hot!elm-webpack?verbose=true&warn=true&debug=true&pathToMake=' + paths.elmMake
      },
      {
        test: /\.css$/,
        loader: 'style!css!postcss'
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
        query: {
          limit: 10000,
          name: 'static/media/[name].[hash:8].[ext]'
        }
      },
      // "file" loader for svg
      {
        test: /\.svg$/,
        loader: 'file',
        query: {
          name: 'static/media/[name].[hash:8].[ext]'
        }
      }
    ]
  },
  postcss: function() {
    return [
      autoprefixer({
        browsers: [
          '>1%',
          'last 4 versions',
          'Firefox ESR',
          'not ie < 9'
        ]
      })
    ];
  },
  plugins: [
    new webpack.DefinePlugin(getClientEnvironment()),
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.template,
      favicon: paths.favicon
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
};
