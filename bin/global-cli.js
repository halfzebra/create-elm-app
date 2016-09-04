#!/usr/bin/env node

const path = require('path');
const argv = require('minimist')(process.argv.slice(2));
const spawn = require('cross-spawn');
const version = require('../package.json').version;
const commands = argv._;
const paths = require('../config/paths');
const executablePaths = require('elm/platform').executablePaths;

function help (version) {
  console.log('\nUsage: elm-app <command>\n');
  console.log('where <command> is one of:');
  console.log('    create, build, start, package, reactor, make, repl\n');
  console.log('elm-app@' + version + ' ' + path.resolve(__dirname, '..'));
}

if (commands.length === 0) {
  help(version);
  process.exit(1);
}

let script = commands[ 0 ];

switch (script) {
  case 'create':
    spawn.sync(
      'node',
      [ path.resolve(paths.scripts, script), commands.splice(1) ],
      { stdio: 'inherit' }
    );
    break;
  case 'build':
    spawn.sync(
      'node',
      [ path.resolve(paths.scripts, script) ],
      { stdio: 'inherit' }
    );
    break;

  case 'eject':
    spawn.sync(
      'node',
      [ path.resolve(paths.scripts, script) ],
      { stdio: 'inherit' }
    );
    break;

  case 'start':
    spawn.sync(
      'node',
      [ path.resolve(paths.scripts, script) ],
      { stdio: 'inherit' }
    );
    break;
  default:

    // Proxy elm-platform cli commands.
    if ([ 'package', 'reactor', 'make', 'repl' ].indexOf(script) !== -1) {
      let executable = executablePaths[ 'elm-' + script ];

      spawn.sync(
        path.normalize(executable),
        process.argv.slice(3),
        { stdio: 'inherit' }
      );
      break;
    } else {
      help(version);
    }

    break;
}