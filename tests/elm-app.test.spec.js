const path = require('path');
const spawn = require('cross-spawn');
const rimraf = require('rimraf');
const expect = require('unexpected');

const testAppName = 'test-app-eject';
const rootDir = path.resolve(__dirname, '..');
const testAppDir = path.join(rootDir, testAppName);
const createElmAppCmd = path.join(rootDir, 'bin/create-elm-app-cli.js');
const elmAppCmd = path.join(rootDir, 'bin/elm-app-cli.js');

describe('Testing Elm application with `elm-app test` (Please wait...)', () => {
  before(done => {
    const { status, stderr } = spawn.sync('node', [
      createElmAppCmd,
      testAppName
    ]);
    if (status === 0) {
      done();
    } else {
      console.log(stderr.toString());
      done(false);
    }
  });

  after(() => {
    rimraf.sync(testAppDir);
  });

  it('`elm-app test` should succeed in `' + testAppName + '`', () => {
    const { status, output } = spawn.sync('node', [elmAppCmd, 'test'], {
      cwd: testAppDir
    });
    const outputString = output
      .map(out => (out !== null ? out.toString() : ''))
      .join('');

    expect(outputString, 'to contain', 'This test should fail');
    expect(outputString, 'to contain', 'failed as expected!');
    expect(status, 'to be', 2);
  }).timeout(2 * 60 * 1000);
});
