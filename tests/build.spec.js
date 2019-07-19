const path = require('path');
const spawn = require('cross-spawn');
const rimraf = require('rimraf');
const expect = require('unexpected');
const Nightmare = require('nightmare');

const testAppName = 'test-app';
const rootDir = path.resolve(__dirname, '..');
const testAppDir = path.join(rootDir, testAppName);
const createElmAppCmd = path.join(rootDir, 'bin/create-elm-app-cli.js');
const elmAppCmd = path.join(rootDir, 'bin/elm-app-cli.js');

describe.skip('Creating and making a build of Elm application', function() {
  this.timeout(1000 * 60 * 5); // 5 minutes.

  before(function(done) {
    this.enableTimeouts(false);
    process.env.PUBLIC_URL = './';
    const { status: createStatus } = spawn.sync(
      'node',
      [createElmAppCmd, testAppName],
      { cwd: rootDir }
    );

    if (createStatus !== 0) {
      return done(false);
    }

    const { status: buildStatus } = spawn.sync('node', [elmAppCmd, 'build'], {
      cwd: testAppDir
    });

    if (buildStatus !== 0) {
      return done(false);
    }

    return done();
  });

  after(() => {
    rimraf.sync(testAppDir);
    this.enableTimeouts(true);
  });

  it('compiled correctly and renders "Your Elm App is working!" text', done => {
    Nightmare()
      .goto('file://' + path.resolve(testAppDir, 'build/index.html'))
      .evaluate(() => document.body.innerText)
      .end()
      .then(result => {
        expect(result.trim(), 'to be', 'Your Elm App is working!');
        done();
      })
      .catch(done);
  });
});
