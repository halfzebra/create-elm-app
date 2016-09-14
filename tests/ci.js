const { expect }  = require('chai');
const spawn = require('cross-spawn');
const rimraf = require('rimraf');
const path = require('path');
const dircompare = require('dir-compare');

const testAppName = 'test-app';

describe('Global CLI', function() {
  it('`create-elm-app` cli should be available', function () {
    let { output } = spawn.sync('create-elm-app');
    expect(output.toString()).to.have.string('Usage: create-elm-app <project-directory>');
  });

  it('`elm-app` cli should be available', function() {
    let { output } = spawn.sync('elm-app');
    expect(output.toString()).to.have.string('Usage: elm-app <command>');
  });
});

describe('Create Elm App', function () {
  before(() => {
    rimraf.sync(testAppName);
  });

  it(`\`create-elm-app\ ${testAppName}\` should succeed`, function() {
    let { status } = spawn.sync('create-elm-app', [ testAppName ]);
    expect(status).to.be.equal(0);
  });

  it('New project should have expected file structure', () => {
    let options = {excludeFilter: 'elm-stuff, elm-package.json'};
    let path1 = path.resolve('template');
    let path2 = path.resolve(testAppName);
    let { same } = dircompare.compareSync(path1, path2, options);
    expect(same).to.be.equal(true);
  });

});

