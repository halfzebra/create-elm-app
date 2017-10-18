/* eslint-env mocha */
const path = require('path');
const expect = require('unexpected');
const spawn = require('cross-spawn');
const dircompare = require('dir-compare');
const fs = require('fs');
const rimraf = require('rimraf');

const root = path.resolve(__dirname, '..');
const testAppName = 'test-app';
const testAppDir = path.join(root, testAppName);
const createElmAppCmd = path.join(
  root,
  './packages/create-elm-app/bin/create-elm-app-cli.js'
);

describe('Create Elm application with `create-elm-app` command', () => {
  after(() => {
    rimraf.sync(testAppDir);
  });

  it(`'create-elm-app ${testAppName}' should succeed`, () => {
    const { status } = spawn.sync('node', [createElmAppCmd, testAppName]);
    expect(status, 'to be', 0);
  }).timeout(60 * 1000);

  it(`'${testAppName}' should have elm-package.json file`, () => {
    expect(
      fs.existsSync(path.join(testAppDir, 'elm-package.json')),
      'to be',
      true
    );
  });

  it(`'${testAppName}' should have .gitignore file`, () => {
    expect(fs.existsSync(path.join(testAppDir, '.gitignore')), 'to be', true);
  });

  it(`'${testAppName}' should have the same file structure as template`, () => {
    const templateDir = path.join(root, './packages/create-elm-app/template');
    const options = {
      excludeFilter: 'elm-stuff, elm-package.json, gitignore, .gitignore',
    };
    const { same } = dircompare.compareSync(templateDir, testAppDir, options);
    expect(same, 'to be', true);
  });
});
