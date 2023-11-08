const spawn = require('cross-spawn');

describe('Test command line interface functionality', () => {
  it('`create-elm-app` command should be available', () => {
    const { output, status } = spawn.sync('create-elm-app');
    expect(output.toString()).toContain(
      'Usage: create-elm-app <project-directory>'
    );
    expect(status).toEqual(1);
  });

  it('`elm-app` command should be available', () => {
    const { output, status } = spawn.sync('elm-app');
    expect(status).toEqual(1);
    expect(output.toString()).toContain('Usage: elm-app <command>');
  });

  it('`elm-app install` command should be available', () => {
    const { output, status } = spawn.sync('elm-app', ['install', '--help']);
    expect(output.toString()).toContain(
      'The `install` command fetches packages'
    );
    expect(status).toEqual(0);
  });
});
