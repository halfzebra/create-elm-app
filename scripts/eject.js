'use strict';

const path = require('path');
const spawn = require('cross-spawn');
const chalk = require('chalk');
const prompt = require('prompt');
const fs = require('fs-extra');
const Table = require('cli-table');
const pkgOwn = require(path.join(__dirname, '../package.json'));

function extendOmittingProps(deps, deleteProps) {
  if (typeof deleteProps === 'undefined') {
    deleteProps = [];
  }

  deps = Object.assign({}, deps);

  deleteProps.forEach(name => {
    delete deps[name];
  });

  return deps;
}

function diffTable(target, mixin, head) {
  if (typeof head === 'undefined') {
    head = [chalk.grey('Name'), chalk.yellow('Old'), chalk.green('New')];
  }

  const table = new Table({
    head: head
  });

  for (const propName in target) {
    if (propName in mixin) {
      const targetPropValue = target[propName];
      const mixinPropValue = mixin[propName];
      // If found and is not equal
      if (targetPropValue !== mixinPropValue) {
        table.push([propName, targetPropValue, mixinPropValue]);
      }
    }
  }

  return table;
}

function promptYesOrNo() {
  return new Promise((resolve, reject) => {
    const property = {
      name: 'answer',
      message: chalk.yellow('Would you like to continue? [Y/n]')
    };

    prompt.start();
    prompt.message = '';

    prompt.get(property, (err, result) => {
      // eslint-disable-line handle-callback-err
      if (result.answer.search(/^y(es)?$/i) !== -1) {
        resolve();
      } else {
        reject('\nAborting...'); // eslint-disable-line prefer-promise-reject-errors
      }
    });
  });
}

function performEject(pkg) {
  // Copy the configuration and start/build scripts.
  try {
    fs.copySync(path.resolve(__dirname, 'build.js'), './scripts/build.js');
    fs.copySync(path.resolve(__dirname, 'start.js'), './scripts/start.js');
    fs.copySync(path.resolve(__dirname, './utils'), './scripts/utils');
    fs.copySync(path.resolve(__dirname, '../config'), './config');
  } catch (err) {
    console.log(chalk.red('Failed to copy scripts, the error is:\n'));
    console.log(err);
    process.exit(1);
  }

  // Update or create new package.json
  fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));

  console.log();
  console.log('Please wait for npm to install all required dependencies...');

  // Install npm packages
  spawn.sync('npm', ['install'], { stdio: 'inherit' });

  console.log();
  console.log(chalk.green('Ejected successfully!'));
}

// The following dependencies will be removed:
const unusedDependencies = ['cross-spawn', 'fs-extra', 'cli-table', 'prompt'];
const devDependencies = extendOmittingProps(
  pkgOwn.dependencies,
  unusedDependencies
);
const scripts = {
  build: 'node scripts/build.js',
  start: 'node scripts/start.js',
  make: 'elm make',
  repl: 'elm repl',
  reactor: 'elm reactor',
  test: 'elm-test'
};

if (fs.existsSync('elm.json') === false) {
  console.log('Please, run the eject script from project root directory');
  process.exit(1);
}

if (fs.existsSync('./package.json') === true) {
  console.log('Found existing package.json');
  const pkgEjected = JSON.parse(
    fs.readFileSync('./package.json', { encoding: 'utf-8' })
  );

  Promise.resolve()
    .then(() => {
      if (pkgEjected.hasOwnProperty('devDependencies')) {
        const diff = diffTable(pkgEjected.devDependencies, devDependencies);
        if (diff.length !== 0) {
          console.log(diff.toString());
          console.log(
            'Ejecting wil overwrite your "devDependencies" in package.json\n'
          );
          return promptYesOrNo();
        }
      }
    })
    .then(() => {
      if (
        pkgEjected.hasOwnProperty('scripts') &&
        Object.keys(pkgEjected.scripts).length === 0
      ) {
        const diff = diffTable(pkgEjected.scripts, scripts);
        if (diff.length !== 0) {
          console.log(diff.toString());
          console.log(
            'Ejecting will overwrite your "scripts" in package.json\n'
          );
          return promptYesOrNo();
        }
      }
    })
    .then(() => {
      pkgEjected.devDependencies = Object.assign(
        {},
        devDependencies,
        pkgEjected.devDependencies
      );
      pkgEjected.scripts = Object.assign({}, scripts, pkgEjected.scripts);
      performEject(pkgEjected);
    })
    .catch(error => {
      console.log(error);
      process.exit(1);
    });
} else {
  console.log(chalk.green('New package.json is created for your project'));
  performEject({
    name: path.basename(process.cwd()),
    version: '1.0.0',
    private: true,
    scripts: scripts,
    devDependencies: devDependencies
  });
}
