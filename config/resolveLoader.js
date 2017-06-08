const isGlobal = require('installed-by-yarn-globally')
const path = require('path')

module.exports = isGlobal ? {
  resolveLoader: {
    modules: ['node_modules', path.resolve(__dirname, '../../')],
    moduleExtensions: ['-loader']
  }
} : {}
