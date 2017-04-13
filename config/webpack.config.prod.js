const autoprefixer = require('autoprefixer')
const DefinePlugin = require('webpack/lib/DefinePlugin')
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const AssetsPlugin = require('assets-webpack-plugin')
const getClientEnvironment = require('./env')
const paths = require('../config/paths')

const root = process.cwd()

module.exports = {

  bail: true,

  entry: [
    paths.entry
  ],

  output: {

    // The build folder.
    path: paths.dist,

    // Append leading slash when production assets are referenced in the html.
    publicPath: process.env.SERVED_PATH || '/',

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
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: true
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss', // https://webpack.js.org/guides/migrating/#complex-options
                plugins: () => [
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
            }
          ]
        })
      },

      {
        exclude: [
          /\.html$/,
          /\.js$/,
          /\.elm$/,
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

    new DefinePlugin(getClientEnvironment()),

    // Remove the content of the ./dist/ folder.
    new CleanWebpackPlugin([ 'dist' ], {
      root: root,
      verbose: false,
      dry: false
    }),

    // Minify the compiled JavaScript.
    new UglifyJsPlugin({
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
}
