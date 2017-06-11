/* eslint-env mocha */
const expect = require('chai').expect;
const spawn = require('cross-spawn');
const rimraf = require('rimraf');

const testAppName = 'test-app';

describe('Test command line interface functionality', function() {
  after(function() {
    rimraf.sync(testAppName);
  });

  describe('CLI accessibility', function() {
    it('`create-elm-app` command should be available', function() {
      const output = spawn.sync('create-elm-app').output;
      expect(output.toString()).to.have.string(
        'Usage: create-elm-app <project-directory>'
      );
    });

    it('`elm-app` command should be available', function() {
      const result = spawn.sync('elm-app');
      const output = result.output;
      expect(output.toString()).to.have.string('Usage: elm-app <command>');
    });

    it('`elm-app package` command should be available', function() {
      const result = spawn.sync('elm-app', ['package']);
      const output = concatsStringBuffers(result.output);
      expect(output).to.have.string('install and publish elm packages');
    });
  });
});

function concatsStringBuffers(buffers) {
  return buffers
    .map(function(out) {
      return out !== null ? out.toString() : '';
    })
    .join('');
}
