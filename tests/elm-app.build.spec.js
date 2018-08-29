const fs = require('fs');
const path = require('path');
const spawn = require('cross-spawn');
const rimraf = require('rimraf');
const expect = require('unexpected');

const testAppName = 'test-app';
const rootDir = path.resolve(__dirname, '..');
const testAppDir = path.join(rootDir, testAppName);
const createElmAppCmd = path.join(rootDir, 'bin/create-elm-app-cli.js');
const elmAppCmd = path.join(rootDir, 'bin/elm-app-cli.js');

describe('Building Elm application with `elm-app build`', () => {
  before(done => {
    const cmd = spawn.sync('node', [createElmAppCmd, testAppName]);
    if (cmd.status === 0) {
      process.chdir(testAppDir);
      done();
    } else {
      done(false);
    }
  });

  after(() => {
    process.chdir(rootDir);
    rimraf.sync(testAppDir);
  });

  it('`elm-app build` should succeed in `' + testAppName + '`', () => {
    const { output, status } = spawn.sync('node', [elmAppCmd, 'build']);
    const outputContent = output
      .map(out => (out !== null ? out.toString() : ''))
      .join('');

    expect(status, 'to be', 0);
    expect(outputContent, 'to contain', 'Compiled successfully.');
    expect(fs.existsSync(path.join(testAppDir, 'build')), 'to be', true);
  }).timeout(12 * 60 * 1000);

  it('`elm-app build` should exit with non zero status code when build failed', () => {
    const normalFile = path.join(testAppDir, 'src/Main.elm');
    const malformedFile = path.join(rootDir, './tests/fixtures/Main.elm');

    copyFileSync(normalFile, 'Main.elm-normal');
    copyFileSync(malformedFile, normalFile);

    const result = spawn.sync('node', [elmAppCmd, 'build']);
    const oldNormalFile = path.resolve('Main.elm-normal');

    copyFileSync(oldNormalFile, normalFile);
    rimraf.sync(oldNormalFile);

    expect(result.status, 'to be greater than or equal to', 1);
  }).timeout(2 * 60 * 1000);
});

function copyFileSync(from, to) {
  const fromData = fs.readFileSync(from);
  fs.writeFileSync(to, fromData);
}
