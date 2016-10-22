#!/usr/bin/env node

const path = require('path');
const argv = require('minimist')(process.argv.slice(2));
const commands = argv._;
const spawn = require('cross-spawn');
const executablePaths = require('elm/platform').executablePaths;
const version = require('../package.json').version;
const elmPlatformVersion = require('../node_modules/elm/package.json').version;
const paths = require('../config/paths');

function help (version) {
  console.log('\nUsage: elm-app <command>\n');
  console.log('where <command> is one of:');
  console.log('    create, build, start, package, reactor, make, repl\n');
  console.log('\nElm ' + elmPlatformVersion + '\n');
  console.log('create-elm-app@' + version + ' ' + path.resolve(__dirname, '..'));
}

if (commands.length === 0) {
  help(version);
  process.exit(1);
}

var script = commands[ 0 ];

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

  case 'test':
    spawn.sync(
      path.resolve(__dirname, '..', 'node_modules/elm-test/bin/elm-test'),
      [ '--compiler', path.normalize(executablePaths['elm-make']) ],
      { stdio: 'inherit' }
    );
    break;
  default:

    // Proxy elm-platform cli commands.
    if ([ 'package', 'reactor', 'make', 'repl' ].indexOf(script) !== -1) {
      var executable = executablePaths[ 'elm-' + script ];

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
