#!/usr/bin/env node

'use strict';

const path = require('path');
const spawn = require('cross-spawn');
const argv = require('minimist')(process.argv.slice(2));
const version = require('../package.json').version;
const which = require('which');
const elmExecutable = which.sync('elm', {nothrow: true}) || require.resolve('elm/bin/elm');
const elmVersion = spawn.sync(elmExecutable, ['--version']).stdout.toString().trim();
const commands = argv._;

if (commands.length === 0) {
  console.log('\nUsage: create-elm-app <project-directory>\n');
  console.log(
    'where <project-directory> is the name of the directory with your future project'
  );
  console.log('\nElm Platform ' + elmVersion + '\n');
  console.log(
    'create-elm-app@' + version + ' ' + path.resolve(__dirname, '..')
  );
  process.exit(1);
}

spawn.sync('node', [path.resolve(__dirname, '../scripts/create'), commands], {
  stdio: 'inherit'
});
