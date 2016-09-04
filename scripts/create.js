const copySync = require('fs-extra').copySync;
const path = require('path');
const chalk = require('chalk');
const pathExists = require('path-exists');
const spawnSync = require('child_process').spawnSync;
const argv = require('minimist')(process.argv.slice(2));
const commands = argv._;
const executablePaths = require('elm/platform').executablePaths;

if (commands.length === 0 || commands[ 0 ] === '') {
  console.error(
    '\nUsage: elm-app create <project-directory>'
  );
  process.exit(1);
}

createElmApp(commands[ 0 ]);

function createElmApp (name) {

  console.log(`\nCreating ${name} project...\n`);

  let root = path.resolve(name);
  let template = path.join(__dirname, '../template');

  if (!pathExists.sync(name)) {

    try {
      copySync(template, root);
    } catch (err) {
      console.log(err);
      process.exit(1);
    }

  } else {
    console.log(`'The directory ${name} already exists. Aborting.`);
    process.exit(1);
  }

  process.chdir(root);

  // Run initial `elm-package install -y`
  spawnSync(executablePaths[ 'elm-package' ], [ 'install', '-y' ], { stdio: 'inherit' });

  console.log(chalk.green(`\nProject is successfully created in \`${root}\`.`));
}