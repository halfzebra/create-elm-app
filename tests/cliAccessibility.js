const expect = require('unexpected');
const spawn = require('cross-spawn');

describe('Test command line interface functionality', () => {
  describe('CLI accessibility', () => {
    it('`create-elm-app` command should be available', () => {
      const { output, status } = spawn.sync('create-elm-app');
      expect(
        output.toString(),
        'to contain',
        'Usage: create-elm-app <project-directory>'
      );
      expect(status, 'to be', 1);
    });

    it('`elm-app` command should be available', () => {
      const { output, status } = spawn.sync('elm-app');
      expect(status, 'to be', 1);
      expect(output.toString(), 'to contain', 'Usage: elm-app <command>');
    });

    it('`elm-app install` command should be available', () => {
      const { output, status } = spawn.sync('elm-app', ['install', '--help']);
      expect(
        output.toString(),
        'to contain',
        'The `install` command fetches packages'
      );
      expect(status, 'to be', 0);
    });
  });
});
