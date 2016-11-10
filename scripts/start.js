const pathExists = require('path-exists');
const chalk = require('chalk');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('../config/webpack.config.dev');
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
const clearConsole = require('react-dev-utils/clearConsole');
const openBrowser = require('react-dev-utils/openBrowser');
const detect = require('detect-port');

process.env.NODE_ENV = 'development';

if (pathExists.sync('elm-package.json') === false) {
  console.log('Please, run the build script from project root directory');
  process.exit(0);
}

// http://webpack.github.io/docs/node.js-api.html#the-long-way
var compiler = webpack(config);
var DEFAULT_PORT = 3000;

compiler.plugin('invalid', function () {
  clearConsole();
  console.log('Compiling...');
});

compiler.plugin('done', function (stats) {
  clearConsole();

  var hasErrors = stats.hasErrors();
  var hasWarnings = stats.hasWarnings();

  if (!hasErrors && !hasWarnings) {

    console.log(chalk.green('Compiled successfully!'));
    console.log('\nThe app is running at:');
    // TODO: display the correct port, if the default is busy.
    console.log('\n    ' + chalk.cyan('http://localhost:' + DEFAULT_PORT + '/'));
    console.log('\nTo create production build, run:');
    console.log('\n    elm-app build');
    return;
  }

  if (hasErrors) {
    console.log(chalk.red('Compilation failed.\n'));

    var json = formatWebpackMessages(stats.toJson({}, true));

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

detect(DEFAULT_PORT, function (err, unoccupiedPort) {

  if (err) {
    console.log(err);
  }

  // TODO: add a prompt, so this message is flushed and user is aware of the port change.
  if (DEFAULT_PORT !== unoccupiedPort) {
    console.log(chalk.yellow('Default DEFAULT_PORT ' + DEFAULT_PORT + ' is already busy, we will use ' + unoccupiedPort));
  }

  // Launch WebpackDevServer.
  devServer.listen(unoccupiedPort, function (err) {
    if (err) {
      return console.log(err);
    }
  });

  openBrowser('http://localhost:' + unoccupiedPort + '/');
});


