const expect = require('chai').expect;
const spawn = require('cross-spawn');
const rimraf = require('rimraf');
const fs = require('fs');
const path = require('path');
const pathExists = require('path-exists');
const dircompare = require('dir-compare');

const testAppName = 'test-app';

describe('Test command line interface functionality', function () {
  after(function () {
    rimraf.sync(testAppName);
  });

  describe('CLI accessibility', function () {
    it('`create-elm-app` command should be available', function () {
      var output = spawn.sync('create-elm-app').output;
      expect(output.toString()).to.have.string('Usage: create-elm-app <project-directory>');
    });

    it('`elm-app` command should be available', function () {
      var result = spawn.sync('elm-app');
      var output = result.output;
      expect(output.toString()).to.have.string('Usage: elm-app <command>');
    });

    it('`elm-app package` command should be available', function () {
      var result = spawn.sync('elm-app', [ 'package' ]);
      var output = concatsStringBuffers(result.output);
      expect(output).to.have.string('install and publish elm packages');
    });
  });

  describe('Create Elm application with `create-elm-app` command', function () {
    it('`create-elm-app ' + testAppName + '` should succeed', function () {
      var status = spawn.sync('create-elm-app', [ testAppName ]).status;
      expect(status).to.be.equal(0);
    }).timeout(60 * 1000);

    it('`' + testAppName + '` should have elm-package.json file', function () {
      expect(pathExists.sync(path.resolve(testAppName, 'elm-package.json'))).to.be.equal(true);
    });

    it('`' + testAppName + '` should have .gitignore file', function () {
      expect(pathExists.sync(path.resolve(testAppName, '.gitignore'))).to.be.equal(true);
    });

    it('`' + testAppName + '` should have the same file structure as template', function () {
      var options = { excludeFilter: 'elm-stuff, elm-package.json, gitignore, .gitignore' };
      var path1 = path.resolve('template');
      var path2 = path.resolve(testAppName);
      var same = dircompare.compareSync(path1, path2, options).same;
      expect(same).to.be.equal(true);
    });
  });

  describe('Building Elm application with `elm-app build`', function () {
    before(function () {
      process.chdir(path.resolve(testAppName));
    });

    after(function () {
      process.chdir(path.resolve('..'));
    });

    it('`elm-app build` should succeed in `' + testAppName + '`', function () {
      var result = spawn.sync('elm-app', [ 'build' ]);
      var outputString = result.output.map(function (out) {
        return (out !== null) ? out.toString() : '';
      }).join('');
      expect(result.status).to.be.equal(0);
      expect(outputString).to.have.string('build is ready in `dist/`');
    }).timeout(12 * 60 * 1000);

    it('`elm-app build` should exit with non zero status code when build failed', function () {
      const normalFile = path.resolve('src/Main.elm');
      const malformedFile = path.resolve('../tests/data/Main.elm');

      copyFileSync(normalFile, 'Main.elm-normal');
      copyFileSync(malformedFile, normalFile)

      const result = spawn.sync('elm-app', [ 'build' ]);

      const oldNormalFile = path.resolve('Main.elm-normal');
      copyFileSync(oldNormalFile, normalFile);
      fs.unlink(oldNormalFile);

      expect(result.status).to.be.at.least(1);
    });
  });

  describe('Ejecting Elm application', function () {
    before(function () {
      process.chdir(path.resolve(testAppName));
    });

    after(function () {
      process.chdir(path.resolve('..'));
    });

    it('`elm-app eject` should succeed in `' + testAppName + '`', function () {
      var result = spawn.sync('elm-app', [ 'eject' ]);
      var outputString = result.output.map(function (out) {
        return (out !== null) ? out.toString() : '';
      }).join('');
      expect(result.status).to.be.equal(0);
      expect(outputString).to.have.string('Ejected successfully!');
    }).timeout(10 * 60 * 1000); // ~ 8 minutes to install npm dependencies.

    it('Ejected application should have `package.json` with scripts from Create Elm App', function () {
      var pkg = fs.readFileSync('./package.json', { encoding: 'utf-8' });
      var pkgConfig = JSON.parse(pkg);
      var scripts = {
        build: 'node scripts/build.js',
        start: 'node scripts/start.js',
        package: 'elm-package',
        make: 'elm-make',
        repl: 'elm-repl',
        reactor: 'elm-reactor'
      };

      expect(objectIntersect(scripts, pkgConfig.scripts)).to.be.equal(true);
    });

    it('Ejected application should have build and start scripts', function () {
      expect(pathExists.sync(path.resolve('./scripts/build.js'))).to.be.equal(true);
      expect(pathExists.sync(path.resolve('./scripts/start.js'))).to.be.equal(true);
    });

    it('Ejected application should have the config available', function () {
      var path1 = path.resolve(__dirname, '../config');
      var path2 = path.resolve('./config');
      var same = dircompare.compareSync(path1, path2).same;
      expect(same).to.be.equal(true);
    });

    it('It should be possible to build ejected applitaction, using npm scripts', function () {
      var result = spawn.sync('npm', [ 'run', 'build' ]);
      var outputString = result.output.map(function (out) {
        return (out !== null) ? out.toString() : '';
      }).join('');
      expect(result.status).to.be.equal(0);
      expect(outputString).to.have.string('build is ready in `dist/`');
    }).timeout(60 * 1000);
  });
});

function objectIntersect (objectA, objectB) {
  var properties = Object.keys(objectA);
  var intersection = properties.filter(function (property) {
    return objectA[ property ] === objectB[ property ];
  });

  return intersection.length === properties.length;
}

function concatsStringBuffers (buffers) {
  return buffers.map(function (out) {
    return (out !== null) ? out.toString() : '';
  }).join('');
}

function copyFileSync(from, to) {
  const fromData = fs.readFileSync(from);
  fs.writeFileSync(to, fromData);
}
