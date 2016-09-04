#!/usr/bin/env node

const path = require('path');
const spawn = require('cross-spawn');
const argv = require('minimist')(process.argv.slice(2));
const commands = argv._;

if (commands.length === 0) {
  console.log('\nUsage: create-elm-app <project-directory>\n');
  process.exit(1);
}

spawn.sync(
  'node',
  [ path.resolve(__dirname, '../scripts/create'), commands ],
  { stdio: 'inherit' }
);