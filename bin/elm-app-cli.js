#!/usr/bin/env node

'use strict';

const path = require('path');
const spawn = require('cross-spawn');
const argv = require('minimist')(process.argv.slice(2));
const elmExecutable = require.resolve('elm/bin/elm');
const version = require('../package.json').version;
const elmVersion = require('elm/package.json').version;

const commands = argv._;

const elmCommands = [
  'repl',
  'init',
  'reactor',
  'make',
  'install',
  'bump',
  'diff',
  'publish'
];

if (commands.length === 0) {
  help(version);
  process.exit(1);
}

const script = commands[0];

switch (script) {
  case 'build':
  case 'eject':
  case 'start':
    if (argv['help']) {
      help(version, 'start');
      break;
    }

    let args = [];
    const env = {};
    Object.keys(argv || {}).forEach(key => {
      if (key === 'browser') {
        // `--no-browser` turns into `--browser false`
        // See https://github.com/substack/minimist/issues/123
        args = args.concat([argv[key] ? '--browser' : '--no-browser']);
      }
      if (key === 'debug' && argv[key] === false) {
        env.ELM_DEBUGGER = 'false';
      }
    });

    spawnSyncNode(path.resolve(__dirname, '../scripts', script), args, env);
    break;

  case 'create':
    spawnSyncNode(path.resolve(__dirname, '../scripts/create'), commands[1]);
    break;

  case 'test': {
    let args = [];
    Object.keys(argv || {}).forEach(key => {
      if (key !== '_' && key !== 'compiler') {
        args = args.concat(['--' + key, argv[key]]);
      }
    });

    args = args.concat(['--compiler', require.resolve('elm/bin/elm')]);
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
    if (elmCommands.indexOf(script) !== -1) {
      spawn.sync(elmExecutable, process.argv.slice(2), {
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
 * @param  {string} version Package version
 * @param  {string} command Name of command for which to print help message
 * @return {undefined}
 */
function help(version, command = '') {
  switch (command) {
    case 'start':
      console.log();
      console.log('Usage: elm-app start [options...]');
      console.log();
      console.log('where [options...] is any number of:');
      console.log('--no-browser\tDo not open the browser automatically');
      console.log('--no-debug\tDisable the elm time travel debugger');
      console.log();
      break;
    case 'test':
      // NOTE: Current implementation calls through to `elm-test` for help message
      break;
    default:
      console.log();
      console.log('Usage: elm-app <command>');
      console.log();
      console.log('where <command> is one of:');
      console.log('    build, start, test, eject, ' + elmCommands.join(', '));
      console.log();
      console.log();
      console.log('Elm ' + elmVersion);
      console.log();
  }

  console.log(
    'create-elm-app@' + version + ' ' + path.resolve(__dirname, '..')
  );
}

/**
 * Spawn separate node process with specified script
 *
 * @param  {string} script Path to script
 * @param  {Array} args   Script arguments
 * @param {Object} env Overwrite process.env properties
 * @return {undefined}
 */
function spawnSyncNode(script, args, env) {
  const cp = spawn.sync('node', [script].concat(args || []), {
    stdio: 'inherit',
    env: Object.assign({}, process.env, env)
  });

  if (cp.status !== 0) {
    process.exit(cp.status);
  }
}
