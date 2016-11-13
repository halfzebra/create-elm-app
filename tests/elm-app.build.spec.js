const fs = require('fs');
const path = require('path');
const spawn = require('cross-spawn');
const rimraf = require('rimraf');
const pathExists = require('path-exists');
const expect = require('chai').expect;


const testAppName = 'test-app';
const rootDir = path.resolve(__dirname, '..');
const testAppDir = path.join(rootDir, testAppName);
const createElmAppCmd = path.join(rootDir, 'bin/create-elm-app-cli.js');
const elmAppCmd = path.join(rootDir, 'bin/elm-app-cli.js');

describe('Building Elm application with `elm-app build`', function () {
  before(function (done) {
    const cmd = spawn.sync('node', [ createElmAppCmd, testAppName ]);

    if (cmd.status === 0) {
      process.chdir(testAppDir);
      done();
    } else {
      done(false);
    }
  });

  after(function () {
    process.chdir(rootDir);
    rimraf.sync(testAppDir);
  });

  it('`elm-app build` should succeed in `' + testAppName + '`', function () {
    var result = spawn.sync('node', [elmAppCmd, 'build' ]);
    var outputString = result.output.map(function (out) {
      return (out !== null) ? out.toString() : '';
    }).join('');
    expect(result.status).to.be.equal(0, 'Incorrect exit status code');
    expect(outputString).to.have.string('build is ready in `dist/`');
    expect(pathExists.sync(path.join(testAppDir, 'dist'))).to.be.equal(true);
  }).timeout(12 * 60 * 1000);

  it('`elm-app build` should exit with non zero status code when build failed', function () {
    const normalFile = path.join(testAppDir, 'src/Main.elm');
    const malformedFile = path.join(rootDir, './tests/data/Main.elm');

    copyFileSync(normalFile, 'Main.elm-normal');
    copyFileSync(malformedFile, normalFile);

    const result = spawn.sync('node', [ elmAppCmd, 'build' ]);

    const oldNormalFile = path.resolve('Main.elm-normal');
    copyFileSync(oldNormalFile, normalFile);
    fs.unlink(oldNormalFile);

    expect(result.status).to.be.at.least(1);
  }).timeout(2 * 60 * 1000);
});

function copyFileSync(from, to) {
  const fromData = fs.readFileSync(from);
  fs.writeFileSync(to, fromData);
}
