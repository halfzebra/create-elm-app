const path = require('path')

const appRoot = process.cwd()

let paths = {
  appRoot,
  entry: path.resolve('./public/js/index.js'),
  dist: path.resolve('./dist'),
  template: path.resolve('./public/index.html'),
  favicon: path.resolve('./public/favicon.ico'),
  elmPkg: path.resolve('elm-package.json'),
  scripts: path.resolve(__dirname, '../scripts'),
  elmMake: path.resolve(__dirname, '../node_modules/.bin/elm-make')
}

module.exports = paths
