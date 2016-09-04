const path = require('path');
const chalk = require('chalk');
const pathExists = require('path-exists');
const spawn = require('cross-spawn');
const { writeFileSync, readFileSync } = require('fs');
const { copySync } = require('fs-extra');
const extend = require('extend');
const Table = require('cli-table');
const pkgOwn = require(path.join(__dirname, '../package.json'));

let pkgEjected;
let devDependencies = pkgOwn.dependencies;
let scripts = {
  build: 'node scripts/build.js',
  start: 'node scripts/start.js'
};

if (pathExists.sync('elm-package.json') === false) {
  console.log('Please, run the build script from project root directory');
  process.exit(1);
}

// Remove create-elm-app dependencies.
delete devDependencies[ 'cross-spawn' ];
delete devDependencies[ 'fs-extra' ];
delete devDependencies[ 'minimist' ];
delete devDependencies[ 'cli-table' ];
delete devDependencies[ 'extend' ];

function diffTable (target, mixin, head = [ chalk.grey('Name'), chalk.yellow('Old'), chalk.green('New') ]) {
  let table = new Table({
    head: head
  });

  for (let propName in target) {
    if (propName in mixin) {
      let targetPropValue = target[ propName ];
      let mixinPropValue = mixin[ propName ];
      // If found and is not equal
      if (targetPropValue !== mixinPropValue) {
        table.push([ propName, targetPropValue, mixinPropValue ]);
      }
    }
  }

  return table;
}

function prompt() {
  process.stdin.once('Would you like to continue? [Y/n]', function(val){
    if (val.search(/^y(es)?$/i) === -1) {
      process.exit(0);
    }
  }).resume();
}

console.log(chalk.yellow('Ejecting will overwrite your exsisting "devDependencies"\n'));

if (pathExists.sync('./package.json') === true) {
  pkgEjected = JSON.parse(readFileSync('./package.json'));

  if (pkgEjected.hasOwnProperty('devDependencies')) {
    let diff = diffTable(pkgEjected.devDependencies, devDependencies);
    if (diff.length !== 0) {
      console.log(diff.toString());
      console.log('Ejecting wil overwrite your "devDependencies" in package.json\n');
      prompt();
      pkgEjected.devDependencies = extend({}, devDependencies, pkgEjected.devDependencies);
    }
  }

  if (pkgEjected.hasOwnProperty('scripts')) {
    let diff = diffTable(pkgEjected.scripts, scripts);
    if (diff.length !== 0) {
      console.log(diff.toString());
      console.log('Ejecting wil overwrite your "scripts" in package.json\n');
      prompt();
      pkgEjected.scripts = extend({}, scripts, pkgEjected.scripts);
    }
  }

} else {
  console.log(chalk.green('New package.json is created for your project'));
  pkgEjected = {
    name: '',
    version: '0.0.1',
    private: true,
    scripts: scripts,
    devDependencies: devDependencies
  };
}

// Copy the configuration and start/build scripts.
try {
  copySync(path.resolve(__dirname, 'build.js'), './scripts/build.js');
  copySync(path.resolve(__dirname, 'start.js'), './scripts/start.js');
  copySync(path.resolve(__dirname, '../config'), './config');
} catch (err) {
  console.log(chalk.red('Failed to copy scripts, the error is:\n'));
  console.log(err);
  process.exit(1);
}

writeFileSync('package.json', JSON.stringify(pkgEjected, null, 2));

spawn.sync(
  'npm',
  [ 'install' ],
  { stdio: 'inherit' }
);

console.log('Ejected successfully!');