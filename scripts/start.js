// Load environment variables from .env file.
// Suppress warnings if this file is missing.
require('dotenv').config({silent: true})

const fs = require('fs')
const chalk = require('chalk')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const config = require('../config/webpack.config.dev')
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages')
const clearConsole = require('react-dev-utils/clearConsole')
const openBrowser = require('react-dev-utils/openBrowser')
const historyApiFallback = require('connect-history-api-fallback')
const httpProxyMiddleware = require('http-proxy-middleware')

if (fs.existsSync('elm-package.json') === false) {
  console.log('Please, run the build script from project root directory')
  process.exit(0)
}

// http://webpack.github.io/docs/node.js-api.html#the-long-way
const compiler = webpack(config)
const port = 3000

compiler.plugin('invalid', function () {
  clearConsole()
  console.log('Compiling...')
})

compiler.plugin('done', function (stats) {
  clearConsole()

  const hasErrors = stats.hasErrors()
  const hasWarnings = stats.hasWarnings()

  if (!hasErrors && !hasWarnings) {
    console.log(chalk.green('Compiled successfully!'))
    console.log('\nThe app is running at:')
    console.log('\n    ' + chalk.cyan('http://localhost:' + port + '/'))
    console.log('\nTo create production build, run:')
    console.log('\n    elm-app build')
    return
  }

  if (hasErrors) {
    console.log(chalk.red('Compilation failed.\n'))

    const json = formatWebpackMessages(stats.toJson({}, true))

    json.errors.forEach(function (message) {
      console.log(message)
      console.log()
    })
  }
})

// We need to provide a custom onError function for httpProxyMiddleware.
// It allows us to log custom error messages on the console.
function onProxyError (proxy) {
  return function (err, req, res) {
    const host = req.headers && req.headers.host
    console.log(
      chalk.red('Proxy error:') + ' Could not proxy request ' + chalk.cyan(req.url) +
      ' from ' + chalk.cyan(host) + ' to ' + chalk.cyan(proxy) + '.'
    )
    console.log(
      'See https://nodejs.org/api/errors.html#errors_common_system_errors for more information (' +
      chalk.cyan(err.code) + ').'
    )
    console.log()

    // And immediately send the proper error response to the client.
    // Otherwise, the request will eventually timeout with ERR_EMPTY_RESPONSE on the client side.
    if (res.writeHead && !res.headersSent) {
      res.writeHead(500)
    }
    res.end('Proxy error: Could not proxy request ' + req.url + ' from ' +
      host + ' to ' + proxy + ' (' + err.code + ').'
    )
  }
}

function addMiddleware (devServer) {
  // `proxy` lets you to specify a fallback server during development.
  // Every unrecognized request will be forwarded to it.
  const proxy = JSON.parse(fs.readFileSync('elm-package.json', 'utf-8')).proxy
  devServer.use(historyApiFallback({
    // Paths with dots should still use the history fallback.
    // See https://github.com/facebookincubator/create-react-app/issues/387.
    disableDotRule: true,
    // For single page apps, we generally want to fallback to /index.html.
    // However we also want to respect `proxy` for API calls.
    // So if `proxy` is specified, we need to decide which fallback to use.
    // We use a heuristic: if request `accept`s text/html, we pick /index.html.
    // Modern browsers include text/html into `accept` header when navigating.
    // However API calls like `fetch()` won’t generally accept text/html.
    // If this heuristic doesn’t work well for you, don’t use `proxy`.
    htmlAcceptHeaders: proxy
      ? [ 'text/html' ]
      : [ 'text/html', '*/*' ]
  }))
  if (proxy) {
    if (typeof proxy !== 'string') {
      console.log(chalk.red('When specified, "proxy" in package.json must be a string.'))
      console.log(chalk.red('Instead, the type of "proxy" was "' + typeof proxy + '".'))
      console.log(chalk.red('Either remove "proxy" from package.json, or make it a string.'))
      process.exit(1)
    }

    // Otherwise, if proxy is specified, we will let it handle any request.
    // There are a few exceptions which we won't send to the proxy:
    // - /index.html (served as HTML5 history API fallback)
    // - /*.hot-update.json (WebpackDevServer uses this too for hot reloading)
    // - /sockjs-node/* (WebpackDevServer uses this for hot reloading)
    // Tip: use https://jex.im/regulex/ to visualize the regex
    const mayProxy = /^(?!\/(index\.html$|.*\.hot-update\.json$|sockjs-node\/)).*$/

    // Pass the scope regex both to Express and to the middleware for proxying
    // of both HTTP and WebSockets to work without false positives.
    const hpm = httpProxyMiddleware(
      function (pathname) {
        return mayProxy.test(pathname)
      },
      {
        target: proxy,
        logLevel: 'silent',
        onProxyReq: function (proxyReq) {
          // Browers may send Origin headers even with same-origin
          // requests. To prevent CORS issues, we have to change
          // the Origin to match the target URL.
          if (proxyReq.getHeader('origin')) {
            proxyReq.setHeader('origin', proxy)
          }
        },
        onError: onProxyError(proxy),
        secure: false,
        changeOrigin: true,
        ws: true
      })
    devServer.use(mayProxy, hpm)

    // Listen for the websocket 'upgrade' event and upgrade the connection.
    // If this is not done, httpProxyMiddleware will not try to upgrade until
    // an initial plain HTTP request is made.
    devServer.listeningApp.on('upgrade', hpm.upgrade)
  }

  // Finally, by now we have certainly resolved the URL.
  // It may be /index.html, so let the dev server try serving it again.
  devServer.use(devServer.middleware)
}

const devServer = new WebpackDevServer(compiler, {
  hot: true,
  inline: true,
  publicPath: '/',
  quiet: true,
  historyApiFallback: true
})

addMiddleware(devServer)

// Launch WebpackDevServer.
devServer.listen(port, function (err) {
  if (err) {
    return console.log(err)
  }
})

openBrowser('http://localhost:' + port + '/')
