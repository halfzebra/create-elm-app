#!/usr/bin/env node

'use strict';

const path = require('path');
const spawn = require('cross-spawn');
const argv = require('minimist')(process.argv.slice(2));
const executablePaths = require('elm/platform').executablePaths;

const version = require('../package.json').version
const elmPlatformVersion = require('elm/package.json').version

const commands = argv._;

if (commands.length === 0) {
  help(version);
  process.exit(1);
}

const script = commands[0];
const scriptArgs = commands.splice(1);

switch (script) {
  case 'create':
  case 'build':
  case 'eject':
  case 'start':
    spawnSyncNode(path.resolve(__dirname, '../scripts', script), scriptArgs);
    break;

  case 'test': {
    let args = [];
    Object.keys(argv || {}).forEach(key => {
      if (key !== '_' && key !== 'compiler') {
        args = args.concat(['--' + key, argv[key]]);
      }
    });

    args = args.concat([
      '--compiler',
      path.normalize(executablePaths['elm-make'])
    ]);

    const cp = spawn.sync(require.resolve('elm-test/bin/elm-test'), args, {
      stdio: 'inherit'
    });

    if (cp.status !== 0) {
      process.exit(cp.status);
    }

    break;
  }
  default:
    // Proxy elm-platform cli commands.
    if (['package', 'reactor', 'make', 'repl'].indexOf(script) !== -1) {
      const executable = executablePaths['elm-' + script];

      spawn.sync(path.normalize(executable), process.argv.slice(3), {
        stdio: 'inherit'
      });
      break;
    } else {
      help(version);
      process.exit(1);
    }
}

/**
 *Prints help message
 *
 * @param  {string} version [description]
 * @return {undefined}
 */
function help(version) {
  console.log('\nUsage: elm-app <command>\n');
  console.log('where <command> is one of:');
  console.log('    create, build, start, package, reactor, make, repl\n');
  console.log('\nElm ' + elmPlatformVersion + '\n');
  console.log(
    'create-elm-app@' + version + ' ' + path.resolve(__dirname, '..')
  );
}

/**
 * Spawn separate node process with specified script
 *
 * @param  {string} script Path to script
 * @param  {Arrays} args   Script arguments
 * @return {undefined}
 */
function spawnSyncNode(script, args) {
  const cp = spawn.sync('node', [script].concat(args || []), {
    stdio: 'inherit'
  });

  if (cp.status !== 0) {
    process.exit(cp.status);
  }
}
