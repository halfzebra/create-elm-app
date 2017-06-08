const autoprefixer = require('autoprefixer')
const HotModuleReplacementPlugin = require('webpack/lib/HotModuleReplacementPlugin')
const DefinePlugin = require('webpack/lib/DefinePlugin')
const NamedModulesPlugin = require('webpack/lib/NamedModulesPlugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const getClientEnvironment = require('./env')
const configPaths = require('../config/paths')
const resolveLoader = require('../config/resolveLoader')

module.exports = Object.assign({
  devtool: 'eval',

  entry: [
    // WebpackDevServer client.
    require.resolve('react-dev-utils/webpackHotDevClient'),

    // Replacement runtime.
    require.resolve('webpack/hot/dev-server'),

    configPaths.entry
  ],

  output: {
    pathinfo: true,

    // The build folder.
    path: configPaths.dist,

    // Generated JS files.
    filename: 'dist/js/bundle.js',

    publicPath: '/'
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
        loader: 'babel-loader',
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
          {
            loader: 'elm-hot-loader'
          },
          {
            loader: 'elm-webpack-loader',
            options: {
              verbose: true,
              warn: true,
              debug: true,
              pathToMake: configPaths.elmMake,
              forceWatch: true
            }
          }
        ]
      },

      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
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
      },

      {
        exclude: [/\.html$/, /\.js$/, /\.elm$/, /\.css$/, /\.json$/, /\.svg$/],
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
    new DefinePlugin(getClientEnvironment()),

    new HtmlWebpackPlugin({
      inject: true,
      template: configPaths.template,
      favicon: configPaths.favicon
    }),

    new HotModuleReplacementPlugin(),

    new NamedModulesPlugin()
  ]
}, resolveLoader)
