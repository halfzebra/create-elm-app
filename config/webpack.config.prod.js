const autoprefixer = require('autoprefixer')
const DefinePlugin = require('webpack/lib/DefinePlugin')
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const AssetsPlugin = require('assets-webpack-plugin')
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin')
const getClientEnvironment = require('./env')
const configPaths = require('../config/paths')

// Webpack uses `publicPath` to determine where the app is being served from.
// It requires a trailing slash, or the file assets will get an incorrect path.
const publicPath = configPaths.servedPath
// `publicUrl` is just like `publicPath`, but we will provide it to our app
// as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
// Omit trailing slash as %PUBLIC_URL%/xyz looks better than %PUBLIC_URL%xyz.
const publicUrl = publicPath.slice(0, -1)

module.exports = {
  bail: true,

  entry: [configPaths.entry],

  output: {
    // The build folder.
    path: configPaths.dist,

    // Append leading slash when production assets are referenced in the html.
    publicPath: publicPath,

    // Generated JS files.
    filename: 'js/[name].[chunkhash:8].js'
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

        // Use the local installation of elm-make
        loader: require.resolve('elm-webpack-loader'),
        options: {
          pathToMake: configPaths.elmMake
        }
      },

      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
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
        })
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

    new InterpolateHtmlPlugin({
      PUBLIC_URL: publicUrl
    }),

    new AssetsPlugin({path: configPaths.dist}),

    new DefinePlugin(getClientEnvironment()),

    // Remove the content of the ./dist/ folder.
    new CleanWebpackPlugin(['dist'], {
      root: configPaths.appRoot,
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
      template: configPaths.template,
      favicon: configPaths.favicon,
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
