/* eslint-disable */
/* eslint-env mocha */
const path = require('path');
const spawn = require('cross-spawn');
const rimraf = require('rimraf');
const expect = require('unexpected');
const Nightmare = require('nightmare');

const root = path.resolve(__dirname, '..');
const testAppName = 'test-app';
const testAppDir = path.join(root, testAppName);
const createElmAppCmd = path.join(
  root,
  './packages/create-elm-app/bin/create-elm-app-cli.js'
);
const elmAppCmd = path.join(
  root,
  './packages/create-elm-app/bin/elm-app-cli.js'
);

describe('Creating and making a build of Elm application', function() {
  this.timeout(30000);

  before(done => {
    process.env.PUBLIC_URL = './';
    spawn('node', [createElmAppCmd, testAppName]).on('close', status => {
      if (status === 0) {
        spawn('node', [elmAppCmd, 'build'], {
          cwd: testAppDir,
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
