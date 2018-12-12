# Create Elm App [![npm version](https://badge.fury.io/js/create-elm-app.svg)](https://badge.fury.io/js/create-elm-app) [![Build Status](https://travis-ci.org/halfzebra/create-elm-app.svg?branch=tests)](https://travis-ci.org/halfzebra/create-elm-app) [![Build Status](https://ci.appveyor.com/api/projects/status/github/halfzebra/create-elm-app?branch=master&svg=true)](https://ci.appveyor.com/project/halfzebra/create-elm-app)

Create Elm apps with no build configuration.

* [Getting Started](#getting-started) – How to create a new app.
* [User Guide](https://github.com/halfzebra/create-elm-app/blob/master/template/README.md) – How to develop apps bootstrapped with Create Elm App.
* [Elm SPA example](https://github.com/halfzebra/elm-spa-example) - Using Create Elm App Elm in SPA example by [Richard Feldman.](https://github.com/rtfeldman)

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

**Node >=8** is required for installation.

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
├── elm.json
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
    └── Tests.elm
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
Developing with Elm is fun and easy, but at some point, you will hit a couple of limitations.

- [elm-make](https://guide.elm-lang.org/install.html#elm-make) has a limited support for working with JavaScript and CSS.
- [elm-reactor](https://guide.elm-lang.org/install.html#elm-reactor) does not work with apps that rely on [ports.](http://guide.elm-lang.org/interop/javascript.html)
- You can not use [Hot Module Replacement.](https://webpack.js.org/concepts/hot-module-replacement)

Create Elm App adds a tool for optimizing production builds and running a development server with your app, which supports HMR.

All of that, combined with all the functionality of [elm](https://guide.elm-lang.org/install.html) in a single command line tool, which you might use as a dependency or `eject` anytime.

## Want a custom setup?

Not happy with the default configuration? Use `elm-app eject` and customize your process.

That way, you can use Create Elm App as a tool for a boilerplate generation.

## Philosophy

Inspired by [create-react-app](https://github.com/facebookincubator/create-react-app)

* **One Dependency:** There is just one build dependency. It uses  Elm Platform, Webpack, and other amazing projects, but provides a cohesive curated experience on top of them.

* **Zero Configuration:** No configuration files or command line options required to start working with Elm. Configuring both development and production builds is handled for you so you can focus on writing code.

* **No Lock-In:** You can “eject” to a custom setup at any time. Run a single command, and all the configuration and build dependencies will be moved directly into your project, so you can pick up right where you left off.

## What is inside

The tools used by Create Elm App are subject to change.
Currently it is a thin layer on top of many amazing community projects, such as:

* [elm](https://github.com/elm/compiler/tree/master/installers/npm)
* [elm-test](https://github.com/elm-community/elm-test)
* [webpack](https://webpack.js.org/) with [webpack-dev-server](https://github.com/webpack/webpack-dev-server), [html-webpack-plugin](https://github.com/ampedandwired/html-webpack-plugin) and [style-loader](https://github.com/webpack/style-loader)
* [Babel](http://babeljs.io/) with ES6
* [Autoprefixer](https://github.com/postcss/autoprefixer)
* and others.

All of them are transitive dependencies of the provided npm package.

## Contributing

We would love to get you involved! Please check our [Contributing Guide](CONTRIBUTING.md) to get started!

## Alternatives

- [parcel](http://blog.hercules-ci.com/elm/2018/11/21/using-elm-and-parcel-for-zero-configuration-web-asset-management/)
- [elm-webpack-starter](https://github.com/elm-community/elm-webpack-starter)
- [spades](https://github.com/rogeriochaves/spades)
- [elm-live](https://github.com/tomekwi/elm-live)
- [elm-app-boilerplate](https://github.com/gkubisa/elm-app-boilerplate)
- [elm-hot-loader-starter](https://github.com/klazuka/example-elm-hot-webpack)
- [generator-elm](https://github.com/danneu/generator-elm)
