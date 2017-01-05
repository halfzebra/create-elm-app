const autoprefixer = require('autoprefixer');
const webpack = require('webpack');
const paths = require('../config/paths');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const getClientEnvironment = require('./env');

const root = process.cwd();

module.exports = {
  bail: true,
  entry: [
    paths.entry
  ],
  output: {

    // The build folder.
    path: paths.dist,

    // Append leading slash when production assets are referenced in the html.
    publicPath: '/',

    // Generated JS files.
    filename: 'js/[name].[chunkhash:8].js'
  },
  resolveLoader: {

    // Look for loaders in own ./node_modules
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

        // Use the local installation of elm-make
        loader: 'elm-webpack',
        query: {
          pathToMake: paths.elmMake
        }
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style', 'css?-autoprefixer!postcss')
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

    // Remove the content of the ./dist/ folder.
    new CleanWebpackPlugin([ 'dist' ], {
      root: root,
      verbose: true,
      dry: false
    }),

    // Minify the compiled JavaScript.
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      output: {
        comments: false
      }
    }),

    new HtmlWebpackPlugin({
      inject: true,
      template: paths.template,
      favicon: paths.favicon,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      }
    }),

    new ExtractTextPlugin('css/[name].[contenthash:8].css')
  ]
};
