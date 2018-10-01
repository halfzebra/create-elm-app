'use strict';

const fs = require('fs');
const copySync = require('fs-extra').copySync;
const path = require('path');
const chalk = require('chalk');
const spawn = require('cross-spawn');
const argv = require('minimist')(process.argv.slice(2));
const commands = argv._;

const isWindows = process.platform === 'win32';

if (commands.length === 0 || commands[0] === '') {
  console.log();
  console.error('Usage: elm-app create <project-directory>');
  process.exit(1);
}

createElmApp(commands[0]);

function createElmApp(name) {
  console.log();
  console.log('Creating ' + name + ' project...');
  console.log();

  const appRoot = path.resolve(name.toString());
  const template = path.join(__dirname, '../template');

  if (!fs.existsSync(name)) {
    try {
      copySync(template, appRoot);
      fs.renameSync(
        path.resolve(appRoot, 'gitignore'),
        path.resolve(appRoot, '.gitignore')
      );
    } catch (err) {
      console.log(err);
      process.exit(1);
    }
  } else {
    console.log('The directory ' + name + ' already exists. Aborting.');
    process.exit(1);
  }

  // Run initial `elm make`
  const spawnElmPkgResult = spawn.sync(
    path.resolve(__dirname, '../node_modules/.bin/elm'),
    // Run elm-make to install the dependencies.
    ['make', 'src/Main.elm', '--output=/dev/null'],
    { stdio: 'inherit', cwd: appRoot }
  );

  if (spawnElmPkgResult.status !== 0) {
    console.log();
    console.log(chalk.red('Failed to install elm packages'));
    console.log();
    console.log('Please, make sure you have internet connection!');
    if (!isWindows) {
      console.log();
      console.log(
        'In case if you are running Unix OS, you might look in to this issue:'
      );
      console.log();
      console.log('    https://github.com/halfzebra/create-elm-app/issues/10');
    }
    process.exit(1);
  }

  console.log();
  console.log(
    chalk.green('Project is successfully created in `' + appRoot + '`.')
  );
  console.log();
  console.log('Inside that directory, you can run several commands:');
  console.log();
  console.log(chalk.cyan('  elm-app start'));
  console.log('    Starts the development server.');
  console.log();
  console.log(chalk.cyan('  elm-app build'));
  console.log('    Bundles the app into static files for production.');
  console.log();
  console.log(chalk.cyan('  elm-app test'));
  console.log('    Starts the test runner.');
  console.log();
  console.log(chalk.cyan('  elm-app eject'));
  console.log(
    '    Removes this tool and copies build dependencies, configuration files'
  );
  console.log(
    '    and scripts into the app directory. If you do this, you can’t go back!'
  );
  console.log();
  console.log('We suggest that you begin by typing:');
  console.log();
  console.log(chalk.cyan('  cd'), name);
  console.log('  ' + chalk.cyan('elm-app start'));
  console.log();
}
