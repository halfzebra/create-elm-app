/* eslint-env mocha */
const path = require('path');
const expect = require('chai').expect;
const spawn = require('cross-spawn');
const dircompare = require('dir-compare');
const fs = require('fs');
const rimraf = require('rimraf');

const testAppName = 'test-app';
const rootDir = path.resolve(__dirname, '..');
const testAppDir = path.join(rootDir, testAppName);
const createElmAppCmd = path.join(rootDir, 'bin/create-elm-app-cli.js');

describe('Create Elm application with `create-elm-app` command', function() {
  after(function() {
    rimraf.sync(testAppDir);
  });

  it('`create-elm-app ' + testAppName + '` should succeed', function() {
    const status = spawn.sync('node', [createElmAppCmd, testAppName]).status;
    expect(status).to.be.equal(0);
  }).timeout(60 * 1000);

  it('`' + testAppName + '` should have elm-package.json file', function() {
    expect(
      fs.existsSync(path.join(testAppDir, 'elm-package.json'))
    ).to.be.equal(true);
  });

  it('`' + testAppName + '` should have .gitignore file', function() {
    expect(fs.existsSync(path.join(testAppDir, '.gitignore'))).to.be.equal(
      true
    );
  });

  it(
    '`' + testAppName + '` should have the same file structure as template',
    function() {
      const templateDir = path.join(rootDir, 'template');
      const options = {
        excludeFilter: 'elm-stuff, elm-package.json, gitignore, .gitignore'
      };
      const same = dircompare.compareSync(templateDir, testAppDir, options)
        .same;
      expect(same).to.be.equal(true);
    }
  );
});
