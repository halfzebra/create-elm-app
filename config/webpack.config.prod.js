'use strict';

const autoprefixer = require('autoprefixer');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const AssetsPlugin = require('assets-webpack-plugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const getClientEnvironment = require('./env');
const paths = require('../config/paths');

// Webpack uses `publicPath` to determine where the app is being served from.
// It requires a trailing slash, or the file assets will get an incorrect path.
const publicPath = paths.servedPath;
// Some apps do not use client-side routing with pushState.
// For these, "homepage" can be set to "." to enable relative asset paths.
const shouldUseRelativeAssetPaths = publicPath === './';
// `publicUrl` is just like `publicPath`, but we will provide it to our app
// as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
// Omit trailing slash as %PUBLIC_URL%/xyz looks better than %PUBLIC_URL%xyz.
const publicUrl = publicPath.slice(0, -1);

// Get environment variables to inject into our app.
const env = getClientEnvironment(publicUrl);

// Note: defined here because it will be used more than once.
const cssFilename = 'static/css/[name].[contenthash:8].css';

// ExtractTextPlugin expects the build output to be flat.
// (See https://github.com/webpack-contrib/extract-text-webpack-plugin/issues/27)
// However, our output is structured with css, js and media folders.
// To have this structure working with relative paths, we have to use custom options.
const extractTextPluginOptions = shouldUseRelativeAssetPaths
  ? // Making sure that the publicPath goes back to to build folder.
    { publicPath: Array(cssFilename.split('/').length).join('../') }
  : {};

module.exports = {
  // Don't attempt to continue if there are any errors.
  bail: true,

  entry: [paths.appIndexJs],

  output: {
    // The build folder.
    path: paths.appBuild,

    // Append leading slash when production assets are referenced in the html.
    publicPath: publicPath,

    // Add /* filename */ comments to generated require()s in the output.
    pathinfo: true,

    // Generated JS files.
    filename: 'static/js/[name].[chunkhash:8].js'
  },

  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.elm']
  },

  module: {
    noParse: /\.elm$/,

    rules: [
      {
        test: /\.js$/,
        exclude: [/elm-stuff/, /node_modules/],
        loader: require.resolve('babel-loader'),
        query: {
          presets: [
            require.resolve('babel-preset-es2015'),
            require.resolve('babel-preset-es2016'),
            require.resolve('babel-preset-es2017')
          ]
        }
      },

      {
        test: /\.elm$/,
        exclude: [/elm-stuff/, /node_modules/],
        use: [
          // string-replace-loader works as InterpolateHtmlPlugin for Elm,
          // it replaces all of the %PUBLIC_URL% with the URL of your
          // application, so you could serve static assets outside of the
          // module system.
          {
            loader: require.resolve('string-replace-loader'),
            query: {
              search: '%PUBLIC_URL%',
              replace: publicUrl
            }
          },
          {
            // Use the local installation of elm-make
            loader: require.resolve('elm-webpack-loader'),
            options: {
              pathToMake: paths.elmMake
            }
          }
        ]
      },

      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract(
          Object.assign(
            {
              fallback: require.resolve('style-loader'),
              use: [
                {
                  loader: require.resolve('css-loader'),
                  options: {
                    minimize: true
                  }
                },
                {
                  loader: require.resolve('postcss-loader'),
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
            },
            extractTextPluginOptions
          )
        )
      },

      {
        exclude: [/\.html$/, /\.js$/, /\.elm$/, /\.css$/, /\.json$/, /\.svg$/],
        loader: require.resolve('url-loader'),
        options: {
          limit: 10000,
          name: 'static/media/[name].[hash:8].[ext]'
        }
      },
      // "file" loader for svg
      {
        test: /\.svg$/,
        loader: require.resolve('file-loader'),
        options: {
          name: 'static/media/[name].[hash:8].[ext]'
        }
      }
    ]
  },

  plugins: [
    new AssetsPlugin({ path: paths.appBuild }),

    new DefinePlugin(env.stringified),

    new InterpolateHtmlPlugin(env.raw),

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
      template: paths.appHtml,
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

    // Note: this won't work without ExtractTextPlugin.extract(..) in `loaders`.
    new ExtractTextPlugin({
      filename: cssFilename
    })
  ]
};
