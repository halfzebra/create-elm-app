const path = require('path');
const spawn = require('cross-spawn');
const rimraf = require('rimraf');

const testAppName = 'test-app-eject';
const rootDir = path.resolve(__dirname, '../..');
const testAppDir = path.join(rootDir, testAppName);
const createElmAppCmd = path.join(rootDir, 'bin/create-elm-app-cli.js');
const elmAppCmd = path.join(rootDir, 'bin/elm-app-cli.js');

describe('Testing Elm application with `elm-app test` (Please wait...)', () => {
  beforeAll((done) => {
    const res = spawn.sync('node', [createElmAppCmd, testAppName]);
    if (res.status === 0) {
      done();
    } else {
      console.log(stderr.toString());
      done(false);
    }
  });

  afterAll(() => {
    rimraf.sync(testAppDir);
  });

  it('`elm-app test` should succeed in `' + testAppName + '`', () => {
    const res = spawn.sync('node', [elmAppCmd, 'test'], {
      cwd: testAppDir,
    });
    const outputString = res.output
      .map((out) => (out !== null ? out.toString() : ''))
      .join('');

    expect(outputString).toContain('This test should fail');
    expect(outputString).toContain('failed as expected!');
    expect(res.status).toEqual(2);
  });
});
