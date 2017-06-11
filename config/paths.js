const path = require('path');
const fs = require('fs');

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebookincubator/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

let paths = {
  appPath: resolveApp('.'),
  appPublic: resolveApp('./public'),
  appHtml: resolveApp('./public/index.html'),
  appIndexJs: resolveApp('./src/index.js'),
  appSrc: resolveApp('./src'),
  entry: resolveApp('./src/index.js'),
  appBuild: resolveApp('./build'),
  elmPkg: resolveApp('./elm-package.json'),
  scripts: path.resolve(__dirname, '../scripts'),
  elmMake: require('elm/platform').executablePaths['elm-make'],
  servedPath: './' || process.env.SERVED_PATH
};

module.exports = paths;
