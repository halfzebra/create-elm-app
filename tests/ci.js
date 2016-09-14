const expect  = require('chai').expect;
const spawn = require('cross-spawn');
const rimraf = require('rimraf');
const path = require('path');
const dircompare = require('dir-compare');

const testAppName = 'test-app';

describe('Test command line interface functionality', function () {
  after(function () {
    rimraf.sync(testAppName);
  });

  describe('Global CLI', function () {
    it('`create-elm-app` cli should be available', function () {
      var output = spawn.sync('create-elm-app').output;
      expect(output.toString()).to.have.string('Usage: create-elm-app <project-directory>');
    });

    it('`elm-app` cli should be available', function () {
      var output = spawn.sync('elm-app').output;
      expect(output.toString()).to.have.string('Usage: elm-app <command>');
    });
  });

  describe('Creating new Elm application', function () {
    before(function () {
      rimraf.sync(path.resolve(testAppName));
    });

    it('`create-elm-app` ' + testAppName + ' should succeed', function () {
      var status = spawn.sync('create-elm-app', [ testAppName ]).status;
      expect(status).to.be.equal(0);
    });

    it('New project should have expected file structure', function () {
      var options = { excludeFilter: 'elm-stuff, elm-package.json' };
      var path1 = path.resolve('template');
      var path2 = path.resolve(testAppName);
      var same = dircompare.compareSync(path1, path2, options).same;
      expect(same).to.be.equal(true);
    });
  });

  describe('Create Elm application with `create-elm-app` command', function () {
    it('`create-elm-app ' + testAppName + '` should succeed', function () {
      var status = spawn.sync('create-elm-app', [ testAppName ]).status;
      expect(status).to.be.equal(0);
    });

    it('New project should have the same file structure as template', function () {
      var options = { excludeFilter: 'elm-stuff, elm-package.json' };
      var path1 = path.resolve('template');
      var path2 = path.resolve(testAppName);
      var same = dircompare.compareSync(path1, path2, options).same;
      expect(same).to.be.equal(true);
    });
  });

  describe('Building Elm application', function () {
    before(function () {
      process.chdir(path.resolve(testAppName));
    });

    after(function () {
      process.chdir(path.resolve('..'));
    });

    it('`elm-app build` should succeed in `' + testAppName + '`', function () {
      var result = spawn.sync('elm-app', [ 'build' ]);
      var outputString = result.output.map(function (out) {
        if (out !== null) {
          return out.toString();
        } else {
          return '';
        }
      }).join('');
      expect(result.status).to.be.equal(0);
      expect(outputString).to.have.string('build is ready in `dist/`');
    });
  });
});
