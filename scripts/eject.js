const path = require('path');
const spawn = require('cross-spawn');
const chalk = require('chalk');
const extend = require('extend');
const pathExists = require('path-exists');
const prompt = require('prompt');
const copySync = require('fs-extra').copySync;
const fs = require('fs');
const Table = require('cli-table');
const Promise = require('bluebird');
const pkgOwn = require(path.join(__dirname, '../package.json'));

function extendOmittingProps(deps, deleteProps) {

  if (typeof deleteProps === 'undefined') {
    deleteProps = [];
  }

  deps = extend({}, deps);

  deleteProps.forEach(function (name) {
    delete deps[ name ];
  });

  return deps;
}

function diffTable (target, mixin, head) {

  if (typeof head === 'undefined') {
    head = [ chalk.grey('Name'), chalk.yellow('Old'), chalk.green('New') ];
  }

  var table = new Table({
    head: head
  });

  for (var propName in target) {
    if (propName in mixin) {
      var targetPropValue = target[ propName ];
      var mixinPropValue = mixin[ propName ];
      // If found and is not equal
      if (targetPropValue !== mixinPropValue) {
        table.push([ propName, targetPropValue, mixinPropValue ]);
      }
    }
  }

  return table;
}

function promptYesOrNo () {
  return new Promise(function (resolve, reject) {
    var property = {
      name: 'answer',
      message: chalk.yellow('Would you like to continue? [Y/n]')
    };

    prompt.start();
    prompt.message = '';

    prompt.get(property, function (err, result) {
      if (result.answer.search(/^y(es)?$/i) !== -1) {
        resolve();
      } else {
        reject('\nAborting...');
      }
    });
  });
}

function performEject (pkg) {
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

  // Update or create new package.json
  fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));

  console.log('\nPlease wait for npm to install all required dependencies.');

  // Install npm packages
  spawn.sync(
    'npm',
    [ 'install' ],
    { stdio: 'inherit' }
  );

  console.log('\nEjected successfully!');
}

// The following dependencies will be removed:
const unusedDependencies = [
  'cross-spawn',
  'fs-extra',
  'minimist',
  'cli-table',
  'extend',
  'prompt',
  'bluebird'
];
const devDependencies = extendOmittingProps(pkgOwn.dependencies, unusedDependencies);
const scripts = {
  build: 'node scripts/build.js',
  start: 'node scripts/start.js',
  package: 'elm-package',
  make: 'elm-make',
  repl: 'elm-repl',
  reactor: 'elm-reactor'
};

if (pathExists.sync('elm-package.json') === false) {
  console.log('Please, run the eject script from project root directory');
  process.exit(1);
}

if (pathExists.sync('./package.json') === true) {
  console.log('Found existing package.json');
  var pkgEjected = JSON.parse(fs.readFileSync('./package.json'));

  Promise.resolve()
    .then(function () {
      if (pkgEjected.hasOwnProperty('devDependencies')) {
        var diff = diffTable(pkgEjected.devDependencies, devDependencies);
        if (diff.length !== 0) {
          console.log(diff.toString());
          console.log('Ejecting wil overwrite your "devDependencies" in package.json\n');
          return promptYesOrNo();
        }
      }
    })
    .then(function () {
      if (pkgEjected.hasOwnProperty('scripts') && Object.keys(pkgEjected.scripts).length === 0) {
        var diff = diffTable(pkgEjected.scripts, scripts);
        if (diff.length !== 0) {
          console.log(diff.toString());
          console.log('Ejecting wil overwrite your "scripts" in package.json\n');
          return promptYesOrNo();
        }
      }
    })
    .then(function () {
      pkgEjected.devDependencies = extend({}, devDependencies, pkgEjected.devDependencies);
      pkgEjected.scripts = extend({}, scripts, pkgEjected.scripts);
      performEject(pkgEjected);
    })
    .catch(function (error) {
      console.log(error);
      process.exit(1);
    });

} else {
  console.log(chalk.green('New package.json is created for your project'));
  performEject({
    name: path.basename(process.cwd()),
    version: '0.0.1',
    private: true,
    scripts: scripts,
    devDependencies: devDependencies
  });
}
