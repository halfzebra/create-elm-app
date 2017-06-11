/* eslint-env mocha */
const fs = require('fs');
const path = require('path');
const expect = require('chai').expect;
const spawn = require('cross-spawn');
const dircompare = require('dir-compare');
const rimraf = require('rimraf');

const testAppName = 'test-app';
const rootDir = path.resolve(__dirname, '..');
const testAppDir = path.join(rootDir, testAppName);
const createElmAppCmd = path.join(rootDir, 'bin/create-elm-app-cli.js');
const elmAppCmd = path.join(rootDir, 'bin/elm-app-cli.js');

describe('Ejecting Elm application. (Please wait...)', function() {
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

  it('`elm-app eject` should succeed in `' + testAppName + '`', function() {
    const result = spawn.sync('node', [elmAppCmd, 'eject']);
    const outputString = result.output
      .map(function(out) {
        return out !== null ? out.toString() : '';
      })
      .join('');

    expect(result.status).to.be.equal(0);
    expect(outputString).to.have.string('Ejected successfully!');
  }).timeout(10 * 60 * 1000);

  it('Ejected application should have `package.json` with scripts from Create Elm App', function() {
    const testAppPkg = path.join(testAppDir, './package.json');
    const pkg = fs.readFileSync(testAppPkg, { encoding: 'utf-8' });
    const pkgScripts = JSON.parse(pkg).scripts;

    expect(pkgScripts).to.have.property('build', 'node scripts/build.js');
    expect(pkgScripts).to.have.property('start', 'node scripts/start.js');
    expect(pkgScripts).to.have.property('package', 'elm-package');
    expect(pkgScripts).to.have.property('make', 'elm-make');
    expect(pkgScripts).to.have.property('repl', 'elm-repl');
    expect(pkgScripts).to.have.property('reactor', 'elm-reactor');
  });

  it('Ejected application should have build and start scripts', function() {
    expect(
      fs.existsSync(path.join(testAppDir, './scripts/build.js'))
    ).to.be.equal(true);
    expect(
      fs.existsSync(path.join(testAppDir, './scripts/start.js'))
    ).to.be.equal(true);
  });

  it('Ejected application should have the config available', function() {
    const path1 = path.join(rootDir, './config');
    const path2 = path.join(testAppDir, './config');
    const same = dircompare.compareSync(path1, path2).same;
    expect(same).to.be.equal(true);
  });

  it(
    'It should be possible to build ejected applitaction, using npm scripts',
    function() {
      const result = spawn.sync('npm', ['run', 'build']);
      const outputString = result.output
        .map(function(out) {
          return out !== null ? out.toString() : '';
        })
        .join('');

      expect(result.status).to.be.equal(0);
      expect(outputString).to.have.string('build is ready in `dist/`');
    }
  ).timeout(5 * 60 * 1000);
});
