const fs = require('fs');
const path = require('path');
const expect = require('unexpected');

const spawn = require('cross-spawn');
const dircompare = require('dir-compare');
const rimraf = require('rimraf');

const testAppName = 'test-app';
const rootDir = path.resolve(__dirname, '..');
const testAppDir = path.join(rootDir, testAppName);
const createElmAppCmd = path.join(rootDir, 'bin/create-elm-app-cli.js');
const elmAppCmd = path.join(rootDir, 'bin/elm-app-cli.js');

describe('Ejecting Elm application. (Please wait...)', function() {
  this.timeout(60000);

  before(done => {
    const { status } = spawn.sync('node', [createElmAppCmd, testAppName]);
    if (status === 0) {
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

  it(`'elm-app eject' should succeed in '${testAppName}'`, () => {
    const { status, output } = spawn.sync('node', [elmAppCmd, 'eject']);
    const outputString = output
      .map(out => (out !== null ? out.toString() : ''))
      .join('');

    expect(status, 'to be', 0);
    expect(outputString, 'to contain', 'Ejected successfully!');
  }).timeout(10 * 60 * 1000);

  it('Ejected application should have `package.json` with scripts from Create Elm App', () => {
    const testAppPkg = path.join(testAppDir, './package.json');
    const pkg = fs.readFileSync(testAppPkg, { encoding: 'utf-8' });
    const pkgScripts = JSON.parse(pkg).scripts;

    expect(pkgScripts, 'to satisfy', {
      build: 'node scripts/build.js',
      start: 'node scripts/start.js',
      make: 'elm make',
      repl: 'elm repl',
      reactor: 'elm reactor'
    });
  });

  it('Ejected application should have build and start scripts', () => {
    expect(
      fs.existsSync(path.join(testAppDir, './scripts/build.js')),
      'to be',
      true
    );
    expect(
      fs.existsSync(path.join(testAppDir, './scripts/start.js')),
      'to be',
      true
    );
  });

  it('Ejected application should have the config available', () => {
    const path1 = path.join(rootDir, './config');
    const path2 = path.join(testAppDir, './config');
    const { same } = dircompare.compareSync(path1, path2);
    expect(same, 'to be', true);
  });

  it('It should be possible to build ejected application, using npm scripts', () => {
    const { status, output } = spawn.sync('npm', ['run', 'build']);
    const outputString = output
      .map(out => (out !== null ? out.toString() : ''))
      .join('');

    expect(status, 'to be', 0);
    expect(outputString, 'to contain', 'Compiled successfully');
  }).timeout(5 * 60 * 1000);

  it('Ejected application should have utility scripts', () => {
    expect(
      fs.existsSync(
        path.join(testAppDir, './scripts/utils/formatElmCompilerErrors.js')
      ),
      'to be',
      true
    );
    expect(
      fs.existsSync(
        path.join(testAppDir, './scripts/utils/webpackHotDevClient.js')
      ),
      'to be',
      true
    );
  });
});
