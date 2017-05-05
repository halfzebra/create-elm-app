const path = require('path')

const appRoot = process.cwd()

let paths = {
  appRoot,
  entry: path.resolve('./public/index.js'),
  dist: path.resolve('./dist'),
  template: path.resolve('./public/index.html'),
  favicon: path.resolve('./public/favicon.ico'),
  elmPkg: path.resolve('elm-package.json'),
  elmMake: require('elm/platform').executablePaths['elm-make'],
  servedPath: './' || process.env.SERVED_PATH
}

module.exports = paths
