// Load environment variables from .env file.
// Suppress warnings if this file is missing.
require('dotenv').config({silent: true})

const fs = require('fs')
const chalk = require('chalk')
const webpack = require('webpack')
const config = require('../config/webpack.config.prod')

if (fs.existsSync('elm-package.json') === false) {
  console.log('Please, run the build script from project root directory')
  process.exit(1)
}

console.log('\nStarting production build...\n')

// Initialize webpack, using the long way: http://webpack.github.io/docs/node.js-api.html#the-long-way
webpack(config).run((err, stats) => { // eslint-disable-line handle-callback-err
  if (stats.compilation.errors.length > 0) {
    console.log(stats.toString({
      chunks: false,
      colors: true,
      assets: false
    }))
    process.exit(1)
  } else {
    const statsFormatted = stats.toString({
      chunks: false,
      colors: true
    })

    console.log(statsFormatted)
    console.log(chalk.green('\n' + 'Production build is ready in `dist/` folder'))
  }
})
