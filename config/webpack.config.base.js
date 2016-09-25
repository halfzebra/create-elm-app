const paths = require('../config/paths');

module.exports = {
  output: {
    // The build folder.
    path: paths.dist
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
        test: /\.css$/,
        loader: 'style!css'
      },
      {
        test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
        exclude: /\/favicon.ico$/,
        loader: 'file',
        query: {
          name: 'static/media/[name].[hash:8].[ext]'
        }
      }
    ]
  }
};
