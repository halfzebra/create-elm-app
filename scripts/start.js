const pathExists = require('path-exists');
const chalk = require('chalk');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('../config/webpack.config.dev');
const opn = require('opn');

process.env.NODE_ENV = 'development';

function clear () {
  console.log('\x1Bc');
}

if (pathExists.sync('elm-package.json') === false) {
  console.log('Please, run the build script from project root directory');
  process.exit(0);
}

// http://webpack.github.io/docs/node.js-api.html#the-long-way
var compiler = webpack(config);
var port = 3000;

compiler.plugin('invalid', function () {
  clear();
  console.log('Compiling...');
});

compiler.plugin('done', function (stats) {
  clear();

  var hasErrors = stats.hasErrors();
  var hasWarnings = stats.hasWarnings();

  if (!hasErrors && !hasWarnings) {

    console.log(chalk.green('Compiled successfully!'));
    console.log('\nThe app is running at:');
    console.log('\n    ' + chalk.cyan('http://localhost:' + port + '/'));
    console.log('\nTo create production build, run:');
    console.log('\n    elm-app build');
    return;
  }

  if (hasErrors) {
    console.log(chalk.red('Compilation failed.\n'));

    var json = stats.toJson({}, true);

    json.errors.forEach(function (message) {
      console.log(message);
      console.log();
    });
  }
});

const devServer = new WebpackDevServer(compiler, {
  hot: true,
  inline: true,
  publicPath: '/',
  quiet: true
});

// Launch WebpackDevServer.
devServer.listen(port, function (err) {
  if (err) {
    return console.log(err);
  }
});

opn('http://localhost:' + port + '/');


