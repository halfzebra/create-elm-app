const path = require('path');
const expect = require('unexpected');
const spawn = require('cross-spawn');
const dircompare = require('dir-compare');
const fs = require('fs');
const rimraf = require('rimraf');

const testAppName = 'test-app-eject';
const rootDir = path.resolve(__dirname, '..');
const testAppDir = path.join(rootDir, testAppName);
const elmAppCmd = path.join(rootDir, 'bin/elm-app-cli.js');

describe('Create Elm application with `elm-app create` command', () => {
  after(() => {
    rimraf.sync(testAppDir);
  });

  it(`'elm-app create ${testAppName}' should succeed`, () => {
    const { status } = spawn.sync('node', [elmAppCmd, 'create', testAppName]);
    expect(status, 'to be', 0);
  }).timeout(60 * 1000);

  it(`'${testAppName}' should have elm.json file`, () => {
    expect(fs.existsSync(path.join(testAppDir, 'elm.json')), 'to be', true);
  });

  it(`'${testAppName}' should have .gitignore file`, () => {
    expect(fs.existsSync(path.join(testAppDir, '.gitignore')), 'to be', true);
  });

  it(`'${testAppName}' should have the same file structure as template`, () => {
    const templateDir = path.join(rootDir, 'template');
    const options = {
      excludeFilter: 'elm-stuff, elm.json, gitignore, .gitignore, build'
    };
    const { same } = dircompare.compareSync(templateDir, testAppDir, options);
    expect(same, 'to be', true);
  });
});
