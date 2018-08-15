'use strict';

const path = require('path');
const autoprefixer = require('autoprefixer');
const HotModuleReplacementPlugin = require('webpack/lib/HotModuleReplacementPlugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const NamedModulesPlugin = require('webpack/lib/NamedModulesPlugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const getClientEnvironment = require('./env');
const paths = require('./paths');

// Webpack uses `publicPath` to determine where the app is being served from.
// In development, we always serve from the root. This makes config easier.
const publicPath = '/';
// `publicUrl` is just like `publicPath`, but we will provide it to our app
// as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
// Omit trailing slash as %PUBLIC_URL%/xyz looks better than %PUBLIC_URL%xyz.
const publicUrl = '';
// Get environment variables to inject into our app.
const env = getClientEnvironment(publicUrl);

module.exports = {
  devtool: 'cheap-module-source-map',

  entry: [
    // Include an alternative client for WebpackDevServer. A client's job is to
    // connect to WebpackDevServer by a socket and get notified about changes.
    // When you save a file, the client will either apply hot updates (in case
    // of CSS changes), or refresh the page (in case of JS changes). When you
    // make a syntax error, this client will display a syntax error overlay.
    // Note: instead of the default WebpackDevServer client, we use a custom one
    // to bring better experience for Create Elm App users. You can replace
    // the line below with these two lines if you prefer the stock client:
    // require.resolve('webpack-dev-server/client') + '?/',
    // require.resolve('webpack/hot/dev-server'),
    // require.resolve('react-dev-utils/webpackHotDevClient'),
    require.resolve('../scripts/utils/webpackHotDevClient'),

    // Errors should be considered fatal in development
    require.resolve('react-error-overlay'),

    paths.appIndexJs
  ],

  output: {
    pathinfo: true,

    // The build folder.
    path: paths.appBuild,

    // This does not produce a real file. It's just the virtual path that is
    // served by WebpackDevServer in development. This is the JS bundle
    // containing code from all our entry points, and the Webpack runtime.
    filename: 'static/js/bundle.js',

    publicPath: publicPath,

    // Point sourcemap entries to original disk location (format as URL on Windows)
    devtoolModuleFilenameTemplate: info =>
      path.resolve(info.absoluteResourcePath).replace(/\\/g, '/')
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
        exclude: [/[/\\\\]elm-stuff[/\\\\]/, /[/\\\\]node_modules[/\\\\]/],
        include: paths.appSrc,
        loader: require.resolve('babel-loader'),
        query: {
          presets: [
            [
              require.resolve('@babel/preset-env'),
              {
                // `entry` transforms `@babel/polyfill` into individual requires for
                // the targeted browsers. This is safer than `usage` which performs
                // static code analysis to determine what's required.
                // This is probably a fine default to help trim down bundles when
                // end-users inevitably import '@babel/polyfill'.
                useBuiltIns: 'entry',
                // Do not transform modules to CJS
                modules: false
              }
            ]
          ],
          plugins: [
            // Polyfills the runtime needed for async/await and generators
            [
              require('@babel/plugin-transform-runtime').default,
              {
                helpers: false,
                regenerator: true
              }
            ]
          ]
        }
      },
      // Process any JS outside of the app with Babel.
      // Unlike the application JS, we only compile the standard ES features.
      {
        test: /\.js$/,
        use: [
          {
            loader: require.resolve('babel-loader'),
            options: {
              babelrc: false,
              compact: false,
              presets: [
                [
                  // Latest stable ECMAScript features
                  require('@babel/preset-env').default,
                  {
                    // Do not transform modules to CJS
                    modules: false
                  }
                ]
              ],
              cacheDirectory: true,
              highlightCode: true
            }
          }
        ]
      },
      {
        test: /\.elm$/,
        include: paths.appSrc,
        exclude: [/[/\\\\]elm-stuff[/\\\\]/, /[/\\\\]node_modules[/\\\\]/],
        use: [
          {
            loader: require.resolve('elm-hot-loader')
          },
          // string-replace-loader works as InterpolateHtmlPlugin for Elm,
          // it replaces all of the %PUBLIC_URL% with the URL of your
          // application, so you could serve static assets outside of the
          // module system.
          {
            loader: require.resolve('string-replace-loader'),
            query: {
              search: '%PUBLIC_URL%',
              replace: publicUrl,
              flags: 'g'
            }
          },
          {
            loader: require.resolve('elm-webpack-loader'),
            options: {
              verbose: true,
              warn: true,
              // If ELM_DEBUGGER was set to "false", disable it. Otherwise
              // for invalid values, "true" and as a default, enable it
              debug: process.env.ELM_DEBUGGER === 'false' ? false : true,
              pathToMake: paths.elmMake,
              forceWatch: true
            }
          }
        ]
      },

      // "postcss" loader applies autoprefixer to our CSS.
      // "css" loader resolves paths in CSS and adds assets as dependencies.
      // "style" loader turns CSS into JS modules that inject <style> tags.
      // In production, we use a plugin to extract that CSS to a file, but
      // in development "style" loader enables hot editing of CSS.
      {
        test: /\.css$/,
        use: [
          require.resolve('style-loader'),
          {
            loader: require.resolve('css-loader'),
            options: {
              importLoaders: 1
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
    new DefinePlugin(env.stringified),

    new InterpolateHtmlPlugin(env.raw),

    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appHtml
    }),

    new HotModuleReplacementPlugin(),

    new NamedModulesPlugin()
  ],

  // Some libraries import Node modules but don't use them in the browser.
  // Tell Webpack to provide empty mocks for them so importing them works.
  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
};
