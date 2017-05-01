const path = require('path')
const isGlobal = require('installed-by-yarn-globally')

const appRoot = process.cwd()

const paths = {
  appRoot,
  entry: path.resolve('./src/index.js'),
  dist: path.resolve('./dist'),
  template: path.resolve('./src/index.html'),
  favicon: path.resolve('./src/favicon.ico'),
  elmPkg: path.resolve('elm-package.json'),
  ownModules: path.resolve(__dirname, '../node_modules'),
  scripts: path.resolve(__dirname, '../scripts'),
  elmMake: path.resolve(__dirname, '../node_modules/.bin/elm-make'),
  resolveLoaderModules: ['node_modules']
}

// If installed globally by yarn, attemt to resolve loaders from the directory above.
if (isGlobal) {
  paths.resolveLoaderModules.push(path.resolve(__dirname, '../../'))
}

module.exports = paths
