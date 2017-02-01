const autoprefixer = require('autoprefixer');
const webpack = require('webpack');
const paths = require('../config/paths');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const AssetsPlugin = require('assets-webpack-plugin');
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

        // Use the local installation of elm-make
        loader: 'elm-webpack-loader',
        options: {
          pathToMake: paths.elmMake
        }
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallbackLoader: 'style-loader',
          loader: [
            {loader: 'css-loader'},
            {loader: 'postcss-loader'}
          ]
        })
      },
      {
        exclude: [
          /\.html$/,
          /\.js$/,
          /\.css$/,
          /\.json$/,
          /\.svg$/
        ],
        loader: 'url-loader',
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

    new AssetsPlugin({ path: paths.dist }),

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
