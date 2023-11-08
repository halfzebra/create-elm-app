const fs = require('fs');
const path = require('path');
const spawn = require('cross-spawn');
const rimraf = require('rimraf');
const Nightmare = require('nightmare');

describe('Building Elm application with `elm-app build`', () => {
  const testAppName = 'test-app';
  const rootDir = path.resolve(__dirname, '../..');
  const testAppDir = path.join(rootDir, testAppName);
  const createElmAppCmd = path.join(rootDir, 'bin/create-elm-app-cli.js');
  const elmAppCmd = path.join(rootDir, 'bin/elm-app-cli.js');

  beforeAll((done) => {
    const cmd = spawn.sync('node', [createElmAppCmd, testAppName]);
    if (cmd.status === 0) {
      process.chdir(testAppDir);
      done();
    } else {
      done(false);
    }
  });

  afterAll(() => {
    process.chdir(rootDir);
    rimraf.sync(testAppDir);
  });

  it('`elm-app build` should succeed in `' + testAppName + '`', () => {
    const { output, status } = spawn.sync('node', [elmAppCmd, 'build']);
    const outputContent = output
      .map((out) => (out !== null ? out.toString() : ''))
      .join('');

    expect(status).toEqual(0);
    expect(outputContent).toContain('Compiled successfully.');
    expect(fs.existsSync(path.join(testAppDir, 'build'))).toEqual(true);
  });

  it('`elm-app build` should exit with non zero status code when build failed', () => {
    const normalFile = path.join(testAppDir, 'src/Main.elm');
    const malformedFile = path.join(rootDir, './tests/fixtures/Main.elm');

    fs.copyFileSync(normalFile, 'Main.elm-normal');
    fs.copyFileSync(malformedFile, normalFile);

    const result = spawn.sync('node', [elmAppCmd, 'build']);
    const oldNormalFile = path.resolve('Main.elm-normal');

    fs.copyFileSync(oldNormalFile, normalFile);
    rimraf.sync(oldNormalFile);

    expect(result.status).toBeGreaterThanOrEqual(1);
  });

  it('compiled correctly and renders "Your Elm App is working!" text', (done) => {
    Nightmare()
      .goto('file://' + path.resolve(testAppDir, 'build/index.html'))
      .evaluate(() => {
        console.log(document.body.innerText);
        return document.body.innerText;
      })
      .end()
      .then((result) => {
        console.log(result);
        expect(result.trim()).toEqual('Your Elm App is working!');
        done();
      })
      .catch(done);
  }, 10000);
});
