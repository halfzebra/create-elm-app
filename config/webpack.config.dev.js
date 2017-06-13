const autoprefixer = require('autoprefixer')
const HotModuleReplacementPlugin = require('webpack/lib/HotModuleReplacementPlugin')
const DefinePlugin = require('webpack/lib/DefinePlugin')
const NamedModulesPlugin = require('webpack/lib/NamedModulesPlugin')
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const getClientEnvironment = require('./env')
const configPaths = require('../config/paths')

// Webpack uses `publicPath` to determine where the app is being served from.
// In development, we always serve from the root. This makes config easier.
const publicPath = '/'
// `publicUrl` is just like `publicPath`, but we will provide it to our app
// as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
// Omit trailing slash as %PUBLIC_PATH%/xyz looks better than %PUBLIC_PATH%xyz.
const publicUrl = ''

module.exports = {
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

    publicPath: publicPath
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
          {
            loader: require.resolve('elm-hot-loader')
          },
          {
            loader: require.resolve('elm-webpack-loader'),
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
            loader: require.resolve('style-loader')
          },
          {
            loader: require.resolve('css-loader')
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
    new DefinePlugin(getClientEnvironment()),

    new InterpolateHtmlPlugin({
      PUBLIC_URL: publicUrl
    }),

    new HtmlWebpackPlugin({
      inject: true,
      template: configPaths.template,
      favicon: configPaths.favicon
    }),

    new HotModuleReplacementPlugin(),

    new NamedModulesPlugin()
  ]
}
