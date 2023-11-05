const path = require('path');
const expect = require('unexpected');
const spawn = require('cross-spawn');
const dircompare = require('dir-compare');
const fs = require('fs');
const rimraf = require('rimraf');

const testAppName = 'test-app';
const rootDir = path.resolve(__dirname, '..');
const testAppDir = path.join(rootDir, testAppName);
const createElmAppCmd = path.join(rootDir, 'bin/create-elm-app-cli.js');

describe('Create Elm application with `create-elm-app` command', () => {
  afterAll(() => {
    rimraf.sync(testAppDir);
  });

  it(`'create-elm-app ${testAppName}' should succeed`, () => {
    const res = spawn.sync('node', [createElmAppCmd, testAppName]);
    console.log(res.output.toString());
    expect(res.status, 'to be', 0);
  });

  it.skip(`'${testAppName}' should have elm.json file`, () => {
    expect(fs.existsSync(path.join(testAppDir, 'elm.json')), 'to be', true);
  });

  it.skip(`'${testAppName}' should have .gitignore file`, () => {
    expect(fs.existsSync(path.join(testAppDir, '.gitignore')), 'to be', true);
  });

  it.skip(`'${testAppName}' should have the same file structure as template`, () => {
    const templateDir = path.join(rootDir, 'template');
    const options = {
      excludeFilter: 'elm-stuff, elm.json, gitignore, .gitignore, build',
    };
    const { same } = dircompare.compareSync(templateDir, testAppDir, options);
    expect(same, 'to be', true);
  });
});
