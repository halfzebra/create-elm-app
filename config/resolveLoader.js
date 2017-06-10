const isGloballyInstalledByYarn = require('installed-by-yarn-globally')
const path = require('path')

let modules = [path.resolve(__dirname, '../node_modules')]

if (isGloballyInstalledByYarn(__dirname)) {
  modules.push(path.resolve(__dirname, '../../'))
}

module.exports = {
  resolveLoader: {
    modules: modules,
    moduleExtensions: ['-loader']
  }
}
