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

describe('Creating and making a build of Elm application', function() {
  this.timeout(60000);

  before(function(done) {
    this.enableTimeouts(false);
    process.env.PUBLIC_URL = './';
    spawn('node', [createElmAppCmd, testAppName]).on('close', status => {
      if (status === 0) {
        spawn('node', [elmAppCmd, 'build'], {
          cwd: testAppDir
        }).on('close', status => {
          if (status === 0) {
            done();
          }
        });
      } else {
        done(false);
      }
    });
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
