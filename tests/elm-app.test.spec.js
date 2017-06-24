/* eslint-env mocha */
const path = require('path');
const spawn = require('cross-spawn');
const rimraf = require('rimraf');
const expect = require('chai').expect;

const testAppName = 'test-app';
const rootDir = path.resolve(__dirname, '..');
const testAppDir = path.join(rootDir, testAppName);
const createElmAppCmd = path.join(rootDir, 'bin/create-elm-app-cli.js');
const elmAppCmd = path.join(rootDir, 'bin/elm-app-cli.js');

describe('Testing Elm application with `elm-app test` (Please wait...)', function() {
  before(function(done) {
    const cmd = spawn.sync('node', [createElmAppCmd, testAppName]);

    if (cmd.status === 0) {
      process.chdir(testAppDir);
      done();
    } else {
      done(false);
    }
  });

  after(function() {
    process.chdir(rootDir);
    rimraf.sync(testAppDir);
  });

  it('`elm-app test` should succeed in `' + testAppName + '`', function() {
    const result = spawn.sync('node', [elmAppCmd, 'test']);
    const outputString = result.output
      .map(function(out) {
        return out !== null ? out.toString() : '';
      })
      .join('');

    expect(result.status).to.be.at.least(1);
    expect(outputString).to.have.string('This test should fail');
    expect(outputString).to.have.string('failed as expected!');
  }).timeout(2 * 60 * 1000);
});
