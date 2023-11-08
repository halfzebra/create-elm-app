const path = require('path');
const fs = require('fs');
const spawn = require('cross-spawn');
const dircompare = require('dir-compare');
const rimraf = require('rimraf');

const testAppName = 'test-app-create';
const rootDir = path.resolve(__dirname, '../..');
const testAppDir = path.join(rootDir, testAppName);
const elmAppCmd = path.join(rootDir, 'bin/elm-app-cli.js');

describe('Create Elm application with `elm-app create` command', () => {
  afterAll(() => {
    rimraf.sync(testAppDir);
  });

  it(`'elm-app create ${testAppName}' should succeed`, () => {
    const res = spawn.sync('node', [elmAppCmd, 'create', testAppName]);
    console.log(res.output.toString());
    expect(res.status).toEqual(0);
  });

  it(`'${testAppName}' should have elm.json file`, () => {
    expect(fs.existsSync(path.join(testAppDir, 'elm.json'))).toEqual(true);
  });

  it(`'${testAppName}' should have .gitignore file`, () => {
    expect(fs.existsSync(path.join(testAppDir, '.gitignore'))).toEqual(true);
  });

  it(`'${testAppName}' should have the same file structure as template`, () => {
    const templateDir = path.join(rootDir, 'template');
    const options = {
      excludeFilter: 'elm-stuff, elm.json, gitignore, .gitignore, build',
    };
    const { same } = dircompare.compareSync(templateDir, testAppDir, options);
    expect(same).toEqual(true);
  });
});
