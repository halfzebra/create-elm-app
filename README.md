# Create Elm App [![npm version](https://badge.fury.io/js/create-elm-app.svg)](https://badge.fury.io/js/create-elm-app) [![Build Status](https://travis-ci.org/halfzebra/create-elm-app.svg?branch=tests)](https://travis-ci.org/halfzebra/create-elm-app)

Create Elm apps with no build configuration.

* [Getting Started](#getting-started) – How to create a new app.
* [User Guide](https://github.com/halfzebra/create-elm-app/blob/master/template/README.md) – How to develop apps bootstrapped with Create Elm App.
* [Adding a CSS Preprocessor (Sass, Less etc.)](#adding-a-css-preprocessor-sass-less-etc)

## Quickstart

```sh
npm install create-elm-app -g
create-elm-app my-app
cd my-app/
elm-app start
```

Create a production build with `elm-app build`

## Getting Started

### Installation

**Node >=6** is required for installation.

#### Yarn

`yarn global add create-elm-app`

#### NPM
`npm install create-elm-app -g`

If you are running Linux OS, you should install it as the superuser:

`sudo npm install create-elm-app -g`

### Creating an App

To create a new app, run:

```sh
create-elm-app my-app
cd my-app/
```

![create-elm-app](https://cloud.githubusercontent.com/assets/3983879/18608348/157f6532-7ce7-11e6-9739-a09f44ae9644.png)

Create a new `my-app` folder with files for your future project.

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

You are ready to employ the full power of Create Elm App!

### `elm-app start`
Run the app in development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

![elm-app-start](https://cloud.githubusercontent.com/assets/3983879/18608347/157e88ec-7ce7-11e6-8924-a046a95f6381.png)

The page will reload if you make edits.
You will see the build errors and lint warnings in the console and the browser window.

### `elm-app build`
Builds the app for production to the `build` folder.
It bundles Elm app and optimizes the build for the best performance.

The build is minified, and the filenames include the hashes.

## Guide
Every generated project will contain a readme with guidelines for future development. 
The latest version is available [here](https://github.com/halfzebra/create-elm-app/blob/master/template/README.md)

## Why use this?
Developing with [elm-platform](https://github.com/elm-lang/elm-platform) is fun and easy, but at some point, you will hit a couple of limitations.

- [elm-make](https://github.com/elm-lang/elm-make) does not provide an efficient build tool for optimizing your project.
- [elm-reactor](https://github.com/elm-lang/elm-reactor) does not work with apps that rely on [ports.](http://guide.elm-lang.org/interop/javascript.html) 
- You can not use [Hot Module Replacement.](https://webpack.github.io/docs/hot-module-replacement.html)

Create Elm App adds a tool for optimizing production builds and running a development server with your app, which supports HMR.

All of that, combined with all the basic functionality of [elm-platform](https://github.com/elm-lang/elm-platform) in a single command line tool, which you might use as a dependency or `eject` anytime.

## Adding a CSS Preprocessor (Sass, Less etc.)

If you find CSS preprocessors valuable you can integrate one. In this walkthrough, we will be using Sass, but you can also use Less, or another alternative.

First we need to create a `package.json` file, since create-elm-app is not shipping one at the moment. Walk through the normal `npm init` process.
```
npm init
```

Second, let’s install the command-line interface for Sass:

```sh
npm install --save node-sass-chokidar
```

Alternatively you may use `yarn`:

```sh
yarn add node-sass-chokidar
```

Then in `package.json`, add the following lines to `scripts`:

```diff
   "scripts": {
+    "build-css": "node-sass-chokidar src/ -o src/",
+    "watch-css": "npm run build-css && node-sass-chokidar src/ -o src/ --watch --recursive",
    ...
   }
```

>Note: To use a different preprocessor, replace `build-css` and `watch-css` commands according to your preprocessor’s documentation.

Now you can rename `src/main.css` to `src/main.scss` and run `npm run watch-css`. The watcher will find every Sass file in `src` subdirectories, and create a corresponding CSS file next to it, in our case overwriting `src/main.css`. Since `src/index.js` still imports `src/main.css`, the styles become a part of your application. You can now edit `src/main.scss`, and `src/main.css` will be regenerated.

To share variables between Sass files, you can use Sass imports. For example, `src/main.scss` and other component style files could include `@import "./shared.scss";` with variable definitions.

To enable importing files without using relative paths, you can add the  `--include-path` option to the command in `package.json`.

```
"build-css": "node-sass-chokidar --include-path ./src --include-path ./node_modules src/ -o src/",
"watch-css": "npm run build-css && node-sass-chokidar --include-path ./src --include-path ./node_modules src/ -o src/ --watch --recursive",
```

This will allow you to do imports like

```scss
@import 'styles/_colors.scss'; // assuming a styles directory under src/
@import 'nprogress/nprogress'; // importing a css file from the nprogress node module
```

At this point you might want to remove all CSS files from the source control, and add `src/**/*.css` to your `.gitignore` file. It is generally a good practice to keep the build products outside of the source control.


**Why `node-sass-chokidar`?**

`node-sass` has been reported as having the following issues:

- `node-sass --watch` has been reported to have *performance issues* in certain conditions when used in a virtual machine or with docker.

- Infinite styles compiling [#1939](https://github.com/facebookincubator/create-react-app/issues/1939)

- `node-sass` has been reported as having issues with detecting new files in a directory [#1891](https://github.com/sass/node-sass/issues/1891)

 `node-sass-chokidar` is used here as it addresses these issues.


## Want a custom setup?

Not happy with the default configuration? Use `elm-app eject` and customize your process.

That way, you can use Create Elm App as a tool for a boilerplate generation.

## Philosophy

Inspired by [create-react-app](https://github.com/facebookincubator/create-react-app)

* **One Dependency:** There is just one build dependency. It uses  Elm Platform, Webpack, and other amazing projects, but provides a cohesive curated experience on top of them.

* **Zero Configuration:** There are no configuration files or command line options. Configuring both development and production builds is handled for you so you can focus on writing code.

* **No Lock-In:** You can “eject” to a custom setup at any time. Run a single command, and all the configuration and build dependencies will be moved directly into your project, so you can pick up right where you left off.

## What is inside

The tools used by Create Elm App are subject to change.
Currently it is a thin layer on top of many amazing community projects, such as:

* [elm-platform](https://github.com/elm-lang/elm-platform)
* [elm-test](https://github.com/elm-community/elm-test)
* [webpack](https://webpack.js.org/) with [webpack-dev-server](https://github.com/webpack/webpack-dev-server), [html-webpack-plugin](https://github.com/ampedandwired/html-webpack-plugin) and [style-loader](https://github.com/webpack/style-loader)
* [Babel](http://babeljs.io/) with ES6
* [Autoprefixer](https://github.com/postcss/autoprefixer)
* and others.

All of them are transitive dependencies of the provided npm package.

## Contributing
We would love to get you involved! Please check our [Contributing Guide](CONTRIBUTING.md) to get started!

## Alternatives
- [elm-webpack-starter](https://github.com/moarwick/elm-webpack-starter)
- [elm-app-boilerplate](https://github.com/gkubisa/elm-app-boilerplate)
- [elm-hot-loader-starter](https://github.com/fluxxu/elm-hot-loader-starter)
- [elm-starter](https://github.com/splodingsocks/elm-starter)
- [elm-live](https://github.com/tomekwi/elm-live)
- [generator-elmlang](https://github.com/Gizra/generator-elmlang)
