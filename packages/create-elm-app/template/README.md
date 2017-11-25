This project is bootstrapped with [Create Elm App](https://github.com/halfzebra/create-elm-app).

Below you will find some information on how to perform basic tasks.  
You can find the most recent version of this guide [here](https://github.com/halfzebra/create-elm-app/blob/master/template/README.md).

## Table of Contents
- [Sending feedback](#sending-feedback)
- [Folder structure](#folder-structure)
- [Installing Elm packages](#installing-elm-packages)
- [Installing JavaScript packages](#installing-javascript-packages)
- [Available scripts](#available-scripts)
  - [elm-app build](#elm-app-build)
  - [elm-app start](#elm-app-start)
  - [elm-app install](#elm-app-install)
  - [elm-app test](#elm-app-test)
  - [elm-app eject](#elm-app-eject)
  - [elm-app <elm-platform-comand>](#elm-app-elm-platform-comand)
    - [package](#package)
    - [repl](#repl)
    - [make](#make)
    - [reactor](#reactor)
- [Turning on/off Elm Debugger](#turning-onoff-elm-debugger)
- [Dead code elimination](#dead-code-elimination)
- [Changing the Page `<title>`](#changing-the-page-title)
- [Adding a Stylesheet](#adding-a-stylesheet)
- [Post-Processing CSS](#post-processing-css)
- [Using elm-css](#using-elm-css)
- [Adding Images and Fonts](#adding-images-and-fonts)
- [Using the `public` Folder](#using-the-public-folder)
  - [Changing the HTML](#changing-the-html)
  - [Adding Assets Outside of the Module System](#adding-assets-outside-of-the-module-system)
  - [When to Use the `public` Folder](#when-to-use-the-public-folder)
- [Setting up API Proxy](#setting-up-api-proxy)
- [Running tests](#running-tests)
  - [Dependencies in Tests](#dependencies-in-tests)
  - [Continuous Integration](#continuous-integration)
- [Making a Progressive Web App](#making-a-progressive-web-app)
  - [Opting Out of Caching](#opting-out-of-caching)
  - [Offline-First Considerations](#offline-first-considerations)
  - [Progressive Web App Metadata](#progressive-web-app-metadata)
- [Deployment](#deployment)
  - [Static Server](#static-server)
  - [GitHub Pages](#github-pages)
- [IDE setup for Hot Module Replacement](#ide-setup-for-hot-module-replacement)

## Sending feedback

You are very welcome with any [feedback](https://github.com/halfzebra/create-elm-app/issues)

## Installing Elm packages

```sh
elm-app install <package-name>
```

Other `elm-package` commands are also [available.](#package)

## Installing JavaScript packages

To use JavaScript packages from npm, you'll need to add a `package.json`, install the dependencies, and you're ready to go.

```sh
npm init -y # Add package.json
npm install --save-dev pouchdb-browser # Install library from npm
```

```js
// Use in your JS code
import PouchDB from 'pouchdb-browser';
const db = new PouchDB('mydb');
```

## Folder structure

```
my-app/
├── .gitignore
├── README.md
├── elm-package.json
├── elm-stuff
├── public
│   ├── favicon.ico
│   ├── index.html
│   ├── logo.svg
│   └── manifest.json
├── src
│   ├── Main.elm
│   ├── index.js
│   ├── main.css
│   └── registerServiceWorker.js
└── tests
    ├── Tests.elm
    └── elm-package.json
```

For the project to build, these files must exist with exact filenames:

- `public/index.html` is the page template;
- `public/favicon.ico` is the icon you see in the browser tab;
- `src/index.js` is the JavaScript entry point.

You can delete or rename the other files.

You may create subdirectories inside src.

## Available scripts
In the project directory you can run:
### `elm-app build`
Builds the app for production to the `build` folder.  

The build is minified, and the filenames include the hashes.  
Your app is ready to be deployed!

### `elm-app start`
Runs the app in the development mode.  
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.  
You will also see any lint errors in the console.

### `elm-app install`

An alias for [`elm-app package install`](#package)

### `elm-app test`
Run tests with [node-test-runner](https://github.com/rtfeldman/node-test-runner/tree/master)

You can make test runner watch project files by running:
```sh
elm-app test --watch
```

### `elm-app eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Elm Platform, etc.) right into your project, so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point, you’re on your own.

You don’t have to use 'eject' The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However, we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

### `elm-app <elm-platform-comand>`

Create Elm App does not rely on the global installation of Elm Platform, but you still can use its local Elm Platform to access default command line tools:

#### `package`

Alias for [elm-package](http://guide.elm-lang.org/get_started.html#elm-package)

Use it for installing Elm packages from [package.elm-lang.org](http://package.elm-lang.org/)

#### `repl`

Alias for [elm-repl](http://guide.elm-lang.org/get_started.html#elm-repl)

#### `make`

Alias for  [elm-make](http://guide.elm-lang.org/get_started.html#elm-make)

#### `reactor`

Alias for  [elm-reactor](http://guide.elm-lang.org/get_started.html#elm-reactor)


## Turning on/off Elm Debugger

By default, in production (`elm-app build`) the Debugger is turned off and in development mode (`elm-app start`) it's turned on.

To turn on/off Elm Debugger explicitly, set `ELM_DEBUGGER` environment variable to `true` or `false` respectively.

## Dead code elimination

Create Elm App comes with an opinionated setup for dead code elimination which is disabled by default, because it may break your code.

You can enable it by setting `DEAD_CODE_ELIMINATION` environment variable to `true`

## Changing the base path of the assets in the HTML

By default, assets will be linked from the HTML to the root url. For example `/css/style.css`.

If you deploy to a path that is not the root, you can change the `PUBLIC_URL` environment variable to properly reference your assets in the compiled assets. For example: `PUBLIC_URL=./ elm-app build`.

## Changing the Page `<title>`

You can find the source HTML file in the `public` folder of the generated project. You may edit the `<title>` tag in it to change the title from “Elm App” to anything else.

Note that normally you wouldn’t edit files in the `public` folder very often. For example, [adding a stylesheet](#adding-a-stylesheet) is done without touching the HTML.

If you need to dynamically update the page title based on the content, you can use the browser [`document.title`](https://developer.mozilla.org/en-US/docs/Web/API/Document/title) API and [ports.](https://guide.elm-lang.org/interop/javascript.html#ports)

## Adding a Stylesheet

This project setup uses [Webpack](https://webpack.js.org/) for handling all assets. Webpack offers a custom way of “extending” the concept of `import` beyond JavaScript. To express that a JavaScript file depends on a CSS file, you need to **import the CSS from the JavaScript file**:

### `main.css`

```css
body {
  padding: 20px;
}
```

### `index.js`

```js
import './main.css'; // Tell Webpack to pick-up the styles from main.css
```

## Post-Processing CSS

This project setup minifies your CSS and adds vendor prefixes to it automatically through [Autoprefixer](https://github.com/postcss/autoprefixer) so you don’t need to worry about it.

For example, this:

```css
.container {
  display: flex;
  flex-direction: row;
  align-items: center;
}
```

becomes this:

```css
.container {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
}
```

In development, expressing dependencies this way allows your styles to be reloaded on the fly as you edit them. In production, all CSS files will be concatenated into a single minified `.css` file in the build output.

You can put all your CSS right into `src/main.css`. It would still be imported from `src/index.js`, but you could always remove that import if you later migrate to a different build tool.

## Using elm-css

### Step 1: Install [elm-css](https://github.com/rtfeldman/elm-css) npm package

```sh
npm install elm-css -g
```

### Step 2: Install Elm dependencies

```sh
elm-app install rtfeldman/elm-css
elm-app install rtfeldman/elm-css-helpers
```

### Step 3: Create the stylesheet file

Create an Elm file at `src/Stylesheets.elm` (The name of this file cannot be changed).

```elm
port module Stylesheets exposing (main, CssClasses(..), CssIds(..), helpers)

import Css exposing (..)
import Css.Elements exposing (body, li)
import Css.Namespace exposing (namespace)
import Css.File exposing (..)
import Html.CssHelpers exposing (withNamespace)


port files : CssFileStructure -> Cmd msg


cssFiles : CssFileStructure
cssFiles =
    toFileStructure [ ( "src/style.css", Css.File.compile [ css ] ) ]


main : CssCompilerProgram
main =
    Css.File.compiler files cssFiles


type CssClasses
    = NavBar


type CssIds
    = Page


appNamespace =
    "App"


helpers =
    withNamespace appNamespace


css =
    (stylesheet << namespace appNamespace)
    [ body
        [ overflowX auto
        , minWidth (px 1280)
        ]
    , id Page
        [ backgroundColor (rgb 200 128 64)
        , color (hex "CCFFFF")
        , width (pct 100)
        , height (pct 100)
        , boxSizing borderBox
        , padding (px 8)
        , margin zero
        ]
    , class NavBar
        [ margin zero
        , padding zero
        , children
            [ li
                [ (display inlineBlock) |> important
                , color primaryAccentColor
                ]
            ]
        ]
    ]


primaryAccentColor =
    hex "ccffaa"
```

### Steap 4: Compiling the stylesheet

To compile the CSS file, just run

```sh
elm-css src/Stylesheets.elm
```

This will generate a file called `style.css`

### Step 5: Import the compiled CSS file

Add the following line to your `src/index.js`:

```js
import './style.css';
```

### Step 6: Using the stylesheet in your Elm code

```elm
import Stylesheets exposing (helpers, CssIds(..), CssClasses(..))


view model =
    div [ helpers.id Page ]
        [ div [ helpers.class [ NavBar ] ]
            [ text "Your Elm App is working!" ]
        ]
```

Please note that `Stylesheets.elm` exposes `helpers` record, which contains functions for creating id and class attributes.

You can also destructure `helpers` to make your view more readable:

```elm
{ id, class } =
    helpers
```

## Adding Images and Fonts

With Webpack, using static assets like images and fonts works similarly to CSS.

By requiring an image in JavaScript code, you tell Webpack to add a file to the build of your application. The variable will contain a unique path to the said file.

Here is an example:

```js
import logoPath from './logo.svg'; // Tell Webpack this JS file uses this image
import { Main } from './Main.elm';

Main.embed(
    document.getElementById('root'),
    logoPath // Pass image path as a flag for Html.programWithFlags
  );
```

Later on, you can use the image path in your view for displaying it in the DOM.

```elm
view : Model -> Html Msg
view model =
    div []
        [ img [ src model.logo ] []
        , div [] [ text model.message ]
        ]
```

## Using the `public` Folder

### Changing the HTML

The `public` folder contains the HTML file so you can tweak it, for example, to [set the page title](#changing-the-page-title).
The `<script>` tag with the compiled code will be added to it automatically during the build process.

### Adding Assets Outside of the Module System

You can also add other assets to the `public` folder.

Note that we normally encourage you to `import` assets in JavaScript files instead.
For example, see the sections on [adding a stylesheet](#adding-a-stylesheet) and [adding images and fonts](#adding-images-fonts-and-files).
This mechanism provides a few benefits:

* Scripts and stylesheets get minified and bundled together to avoid extra network requests.
* Missing files cause compilation errors instead of 404 errors for your users.
* Result filenames include content hashes, so you don’t need to worry about browsers caching their old versions.

However, there is a **escape hatch** that you can use to add an asset outside of the module system.

If you put a file into the `public` folder, it will **not** be processed by Webpack. Instead, it will be copied into the build folder untouched.   To reference assets in the `public` folder, you need to use a special variable called `PUBLIC_URL`.

Inside `index.html`, you can use it like this:

```html
<link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
```

Only files inside the `public` folder will be accessible by `%PUBLIC_URL%` prefix. If you need to use a file from `src` or `node_modules`, you’ll have to copy it there to explicitly specify your intention to make this file a part of the build.

When you run `elm-app build`, Create Elm App will substitute `%PUBLIC_URL%` with a correct absolute path, so your project works even if you use client-side routing or host it at a non-root URL.

In Elm code, you can use `%PUBLIC_URL%` for similar purposes:

```elm
// Note: this is an escape hatch and should be used sparingly!
// Normally we recommend using `import`  and `Html.programWithFlags` for getting 
// asset URLs as described in “Adding Images and Fonts” above this section.
img [ src "%PUBLIC_URL%/logo.svg" ] []
```

In JavaScript code, you can use `process.env.PUBLIC_URL` for similar purposes:

```js
const logo = `<img src=${process.env.PUBLIC_URL + '/img/logo.svg'} />`;
```

Keep in mind the downsides of this approach:

* None of the files in `public` folder get post-processed or minified.
* Missing files will not be called at compilation time, and will cause 404 errors for your users.
* Result filenames won’t include content hashes so you’ll need to add query arguments or rename them every time they change.

### When to Use the `public` Folder

Normally we recommend importing [stylesheets](#adding-a-stylesheet), [images, and fonts](#adding-images-fonts-and-files) from JavaScript.
The `public` folder is used as a workaround for some less common cases:

* You need a file with a specific name in the build output, such as [`manifest.webmanifest`](https://developer.mozilla.org/en-US/docs/Web/Manifest).
* You have thousands of images and need to dynamically reference their paths.
* You want to include a small script like [`pace.js`](http://github.hubspot.com/pace/docs/welcome/) outside of the bundled code.
* Some library may be incompatible with Webpack and you have no other option but to include it as a `<script>` tag.

Note that if you add a `<script>` that declares global variables, you also need to read the next section on using them.


## Setting up API Proxy
To forward the API ( REST ) calls to backend server, add a proxy to the `elm-package.json` in the top level json object.

```json
{
    ...
    "proxy" : "http://localhost:1313",
    ...
}
```

Make sure the XHR requests set the `Content-type: application/json` and `Accept: application/json`.
The development server has heuristics, to handle its own flow, which may interfere with proxying of 
other html and javascript content types.

```sh
 curl -X GET -H "Content-type: application/json" -H "Accept: application/json"  http://localhost:3000/api/list
```

## Running Tests

Create Elm App uses [elm-test](https://github.com/rtfeldman/node-test-runner) as its test runner.

### Dependencies in Tests

To use packages in tests, you also need to install them in `tests` directory.

```bash
elm-app test --add-dependencies elm-package.json 
```

### Continuous Integration

#### Travis CI

1. Following the [Travis Getting started](https://docs.travis-ci.com/user/getting-started/) guide for syncing your GitHub repository with Travis.  You may need to initialize some settings manually in your [profile](https://travis-ci.org/profile) page.
1. Add a `.travis.yml` file to your git repository.

```yaml
language: node_js

sudo: required

node_js:
  - '7'

install:
  - npm i create-elm-app -g

script: elm-app test
```

1. Trigger your first build with a git push.
1. [Customize your Travis CI Build](https://docs.travis-ci.com/user/customizing-the-build/) if needed.

## Making a Progressive Web App

By default, the production build is a fully functional, offline-first
[Progressive Web App](https://developers.google.com/web/progressive-web-apps/).

Progressive Web Apps are faster and more reliable than traditional web pages, and provide an engaging mobile experience:

 * All static site assets are cached so that your page loads fast on subsequent visits, regardless of network connectivity (such as 2G or 3G). Updates are downloaded in the background.
 * Your app will work regardless of network state, even if offline. This means your users will be able to use your app at 10,000 feet and on the Subway.
 * On mobile devices, your app can be added directly to the user's home screen, app icon and all. You can also re-engage users using web **push notifications**. This eliminates the need for the app store.

The [`sw-precache-webpack-plugin`](https://github.com/goldhand/sw-precache-webpack-plugin)
is integrated into production configuration,
and it will take care of generating a service worker file that will automatically
precache all of your local assets and keep them up to date as you deploy updates.
The service worker will use a [cache-first strategy](https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook/#cache-falling-back-to-network)
for handling all requests for local assets, including the initial HTML, ensuring
that your web app is reliably fast, even on a slow or unreliable network.

### Opting Out of Caching

If you would prefer not to enable service workers prior to your initial
production deployment, then remove the call to `serviceWorkerRegistration.register()`
from [`src/index.js`](src/index.js).

If you had previously enabled service workers in your production deployment and
have decided that you would like to disable them for all your existing users,
you can swap out the call to `serviceWorkerRegistration.register()` in
[`src/index.js`](src/index.js) with a call to `serviceWorkerRegistration.unregister()`.
After the user visits a page that has `serviceWorkerRegistration.unregister()`,
the service worker will be uninstalled. Note that depending on how `/service-worker.js` is served,
it may take up to 24 hours for the cache to be invalidated.

### Offline-First Considerations

1. Service workers [require HTTPS](https://developers.google.com/web/fundamentals/getting-started/primers/service-workers#you_need_https),
although to facilitate local testing, that policy
[does not apply to `localhost`](http://stackoverflow.com/questions/34160509/options-for-testing-service-workers-via-http/34161385#34161385).
If your production web server does not support HTTPS, then the service worker
registration will fail, but the rest of your web app will remain functional.

1. Service workers are [not currently supported](https://jakearchibald.github.io/isserviceworkerready/)
in all web browsers. Service worker registration [won't be attempted](src/registerServiceWorker.js)
on browsers that lack support.

1. The service worker is only enabled in the [production environment](#deployment),
e.g. the output of `npm run build`. It's recommended that you do not enable an
offline-first service worker in a development environment, as it can lead to
frustration when previously cached assets are used and do not include the latest
changes you've made locally.

1. If you *need* to test your offline-first service worker locally, build
the application (using `npm run build`) and run a simple http server from your
build directory. After running the build script, `create-react-app` will give
instructions for one way to test your production build locally and the [deployment instructions](#deployment) have
instructions for using other methods. *Be sure to always use an
incognito window to avoid complications with your browser cache.*

1. If possible, configure your production environment to serve the generated
`service-worker.js` [with HTTP caching disabled](http://stackoverflow.com/questions/38843970/service-worker-javascript-update-frequency-every-24-hours).
If that's not possible—[GitHub Pages](#github-pages), for instance, does not
allow you to change the default 10 minute HTTP cache lifetime—then be aware
that if you visit your production site, and then revisit again before
`service-worker.js` has expired from your HTTP cache, you'll continue to get
the previously cached assets from the service worker. If you have an immediate
need to view your updated production deployment, performing a shift-refresh
will temporarily disable the service worker and retrieve all assets from the
network.

1. Users aren't always familiar with offline-first web apps. It can be useful to
[let the user know](https://developers.google.com/web/fundamentals/instant-and-offline/offline-ux#inform_the_user_when_the_app_is_ready_for_offline_consumption)
when the service worker has finished populating your caches (showing a "This web
app works offline!" message) and also let them know when the service worker has
fetched the latest updates that will be available the next time they load the
page (showing a "New content is available; please refresh." message). Showing
this messages is currently left as an exercise to the developer, but as a
starting point, you can make use of the logic included in [`src/registerServiceWorker.js`](src/registerServiceWorker.js), which
demonstrates which service worker lifecycle events to listen for to detect each
scenario, and which as a default, just logs appropriate messages to the
JavaScript console.

1. By default, the generated service worker file will not intercept or cache any
cross-origin traffic, like HTTP [API requests](#integrating-with-an-api-backend),
images, or embeds loaded from a different domain. If you would like to use a
runtime caching strategy for those requests, you can [`eject`](#npm-run-eject)
and then configure the
[`runtimeCaching`](https://github.com/GoogleChrome/sw-precache#runtimecaching-arrayobject)
option in the `SWPrecacheWebpackPlugin` section of
[`webpack.config.prod.js`](../config/webpack.config.prod.js).

### Progressive Web App Metadata

The default configuration includes a web app manifest located at
[`public/manifest.json`](public/manifest.json), that you can customize with
details specific to your web application.

When a user adds a web app to their homescreen using Chrome or Firefox on
Android, the metadata in [`manifest.json`](public/manifest.json) determines what
icons, names, and branding colors to use when the web app is displayed.
[The Web App Manifest guide](https://developers.google.com/web/fundamentals/engage-and-retain/web-app-manifest/)
provides more context about what each field means, and how your customizations
will affect your users' experience.

## Deployment


`elm-app build` creates a `build` directory with a production build of your app. Set up your favourite HTTP server so that a visitor to your site is served `index.html`, and requests to static paths like `/static/js/main.<hash>.js` are served with the contents of the `/static/js/main.<hash>.js` file.

### Static Server

For environments using [Node](https://nodejs.org/), the easiest way to handle this would be to install [serve](https://github.com/zeit/serve) and let it handle the rest:

```sh
npm install -g serve
serve -s build
```

The last command shown above will serve your static site on the port **5000**. Like many of [serve](https://github.com/zeit/serve)’s internal settings, the port can be adjusted using the `-p` or `--port` flags.

Run this command to get a full list of the options available:

```sh
serve -h
```

### GitHub Pages

#### Step 1: Add `homepage` to `elm-package.json`

**The step below is important!**<br>
**If you skip it, your app will not deploy correctly.**

Open your `elm-package.json` and add a `homepage` field:

```js
  "homepage": "https://myusername.github.io/my-app",
```

Create Elm App uses the `homepage` field to determine the root URL in the built HTML file.

#### Step 2: Deploy the site by running `gh-pages -d build`

Then run:

```sh
gh-pages -d build
```

#### Step 3: Ensure your project’s settings use `gh-pages`

Finally, make sure **GitHub Pages** option in your GitHub project settings is set to use the `gh-pages` branch:

<img src="http://i.imgur.com/HUjEr9l.png" width="500" alt="gh-pages branch setting">

#### Step 4: Optionally, configure the domain

You can configure a custom domain with GitHub Pages by adding a `CNAME` file to the `public/` folder.

#### Notes on client-side routing

GitHub Pages doesn’t support routers that use the HTML5 `pushState` history API under the hood (for example, React Router using `browserHistory`). This is because when there is a fresh page load for a url like `http://user.github.io/todomvc/todos/42`, where `/todos/42` is a frontend route, the GitHub Pages server returns 404 because it knows nothing of `/todos/42`. If you want to add a router to a project hosted on GitHub Pages, here are a couple of solutions:

* You could switch from using HTML5 history API to routing with hashes.
* Alternatively, you can use a trick to teach GitHub Pages to handle 404 by redirecting to your `index.html` page with a special redirect parameter. You would need to add a `404.html` file with the redirection code to the `build` folder before deploying your project, and you’ll need to add code handling the redirect parameter to `index.html`. You can find a detailed explanation of this technique [in this guide](https://github.com/rafrex/spa-github-pages).

## IDE setup for Hot Module Replacement

Remember to disable [safe write](https://webpack.github.io/docs/webpack-dev-server.html#working-with-editors-ides-supporting-safe-write) if you are using VIM or IntelliJ IDE, such as WebStorm.
