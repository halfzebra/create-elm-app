/* eslint-env mocha */
const path = require('path');
const spawn = require('cross-spawn');
const rimraf = require('rimraf');
const expect = require('unexpected');

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

describe('Testing Elm application with `elm-app test` (Please wait...)', () => {
  before(done => {
    const { status } = spawn.sync('node', [createElmAppCmd, testAppName], {
      cwd: root,
    });
    if (status === 0) {
      done();
    } else {
      done(false);
    }
  });

  after(() => {
    rimraf.sync(testAppDir);
  });

  it('`elm-app test` should succeed in `' + testAppName + '`', () => {
    const { status, output } = spawn.sync(
      'node',
      [elmAppCmd, 'test', { cwd: testAppDir }],
      {
        cwd: testAppDir,
      }
    );
    const outputString = output
      .map(out => (out !== null ? out.toString() : ''))
      .join('');

    expect(status, 'to be', 2);
    expect(outputString, 'to contain', 'This test should fail');
    expect(outputString, 'to contain', 'failed as expected!');
  }).timeout(2 * 60 * 1000);
});
