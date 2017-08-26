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
- [Turning off Elm Debugger](#turning-off-elm-debugger)
- [Changing the Page `<title>`](#changing-the-page-title)
- [Adding a Stylesheet](#adding-a-stylesheet)
- [Adding Images and Fonts](#adding-images-and-fonts)
- [Using the `public` Folder](#using-the-public-folder)
  - [Changing the HTML](#changing-the-html)
  - [Adding Assets Outside of the Module System](#adding-assets-outside-of-the-module-system)
  - [When to Use the `public` Folder](#when-to-use-the-public-folder)
- [Setting up API Proxy](#setting-up-api-proxy)
- [Running tests](#running-tests)
  - [Dependencies in Tests](#dependencies-in-tests)
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
  .gitignore
  README.md
  elm-package.json
  public/
    favicon.ico
    index.html
  src/
    Main.elm
    index.js
    main.css
  tests/
    elm-package.json
    Main.elm
    Tests.elm
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

Create Elm App does not rely on the global installation of Elm Platform, but you still can use it's local Elm Platform to access default command line tools:

#### `package`

Alias for [elm-package](http://guide.elm-lang.org/get_started.html#elm-package)

Use it for installing Elm packages from [package.elm-lang.org](http://package.elm-lang.org/)

#### `repl`

Alias for [elm-repl](http://guide.elm-lang.org/get_started.html#elm-repl)

#### `make`

Alias for  [elm-make](http://guide.elm-lang.org/get_started.html#elm-make)

#### `reactor`

Alias for  [elm-reactor](http://guide.elm-lang.org/get_started.html#elm-reactor)


## Turning off Elm Debugger

To turn off Elm Debugger, set `ELM_DEBUGGER` environment variable to `false`

## Changing the base path of the assets in the HTML

By default assets will be linked from the HTML to the root url. For example `/css/style.css`.

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
import './main.css'; // Tell Webpack to pick-up the styles from base.css
```

In development, expressing dependencies this way allows your styles to be reloaded on the fly as you edit them. In production, all CSS files will be concatenated into a single minified `.css` file in the build output.

You can put all your CSS right into `src/main.css`. It would still be imported from `src/index.js`, but you could always remove that import if you later migrate to a different build tool.

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
This mechanism provides a number of benefits:

* Scripts and stylesheets get minified and bundled together to avoid extra network requests.
* Missing files cause compilation errors instead of 404 errors for your users.
* Result filenames include content hashes so you don’t need to worry about browsers caching their old versions.

However there is an **escape hatch** that you can use to add an asset outside of the module system.

If you put a file into the `public` folder, it will **not** be processed by Webpack. Instead it will be copied into the build folder untouched.   To reference assets in the `public` folder, you need to use a special variable called `PUBLIC_URL`.

Inside `index.html`, you can use it like this:

```html
<link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
```

Only files inside the `public` folder will be accessible by `%PUBLIC_URL%` prefix. If you need to use a file from `src` or `node_modules`, you’ll have to copy it there to explicitly specify your intention to make this file a part of the build.

When you run `elm-app build`, Create Elm App will substitute `%PUBLIC_URL%` with a correct absolute path so your project works even if you use client-side routing or host it at a non-root URL.

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
The `public` folder is useful as a workaround for a number of less common cases:

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
The development server has heuristics, to handle it's own flow, which may interfere with proxying of 
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

Create React App uses the `homepage` field to determine the root URL in the built HTML file.

The `predeploy` script will run automatically before `deploy` is run.

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
