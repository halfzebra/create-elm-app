const fs = require('fs');
const copySync = require('fs-extra').copySync;
const path = require('path');
const chalk = require('chalk');
const spawnSync = require('child_process').spawnSync;
const argv = require('minimist')(process.argv.slice(2));
const commands = argv._;
const executablePaths = require('elm/platform').executablePaths;

if (commands.length === 0 || commands[0] === '') {
  console.error('\nUsage: elm-app create <project-directory>');
  process.exit(1);
}

createElmApp(commands[0]);

function createElmApp(name) {
  console.log('\nCreating ' + name + ' project...\n');

  const root = path.resolve(name);
  const template = path.join(__dirname, '../template');

  if (!fs.existsSync(name)) {
    try {
      copySync(template, root);
      fs.renameSync(
        path.resolve(root, 'gitignore'),
        path.resolve(root, '.gitignore')
      );
    } catch (err) {
      console.log(err);
      process.exit(1);
    }
  } else {
    console.log('The directory ' + name + ' already exists. Aborting.');
    process.exit(1);
  }

  process.chdir(root);

  // Run initial `elm-package install -y`
  const spawnElmPkgResult = spawnSync(
    executablePaths['elm-package'],
    ['install', '-y'],
    { stdio: 'inherit' }
  );

  if (spawnElmPkgResult.status !== 0) {
    console.log(chalk.red('\nFailed to install elm packages'));
    console.log('\nPlease, make sure you have internet connection!');
    console.log(
      '\nIn case if you are running Unix OS, you might look in to this issue:'
    );
    console.log('\n    https://github.com/halfzebra/create-elm-app/issues/10');
    process.exit(1);
  }

  console.log(
    chalk.green('\nProject is successfully created in `' + root + '`.')
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
