# Create Elm App

[![npm version](https://badge.fury.io/js/create-elm-app.svg)](https://badge.fury.io/js/create-elm-app)
[![Build Status](https://travis-ci.org/halfzebra/create-elm-app.svg?branch=tests)](https://travis-ci.org/halfzebra/create-elm-app)

Create Elm apps with no build configuration.

* [Getting Started](#getting-started) – How to create a new app.
* [User Guide](https://github.com/halfzebra/create-elm-app/blob/master/template/README.md) – How to develop apps bootstrapped with Create Elm App.

## Quickstart

```sh
npm install create-elm-app -g
create-elm-app my-app
cd my-app/
elm-app start
```

When you are done developing, create a production build with `elm-app build`

## Getting Started

### Installation
Node >=4 is required only as a build dependency.

`npm install create-elm-app -g`

### Creating an App

To create a new app, run:

```sh
create-elm-app my-app
cd my-app/
```

![create-elm-app](https://cloud.githubusercontent.com/assets/3983879/18608348/157f6532-7ce7-11e6-9739-a09f44ae9644.png)

This will create a new `my-app` folder with files for your future project.

```
my-app/
  README.md
  elm-package.json
  src/
    favicon.ico
    index.html
    index.js
    main.css
    Main.elm
```

When installation is done, you can run other commands from the project directory.

### `elm-app start`
Runs the app in development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

![elm-app-start](https://cloud.githubusercontent.com/assets/3983879/18608347/157e88ec-7ce7-11e6-8924-a046a95f6381.png)

The page will reload if you make edits.
You will see the build errors and lint warnings in the console.

### `elm-app build`
Builds the app for production to the `build` folder.
It bundles Elm app and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.

## Guide
Every generated project will contain a readme with guidelines for future development. 
The latest version is avalilable [here](https://github.com/halfzebra/create-elm-app/blob/master/template/README.md)

## Why use this?
Developing with [elm-platform](https://github.com/elm-lang/elm-platform) is fun and easy, but at some point you will hit a couple limitations.

- [elm-make](https://github.com/elm-lang/elm-make) does not provide an efficient build tool for optimizing your project.
- [elm-reactor](https://github.com/elm-lang/elm-reactor) does not work with apps, that rely on [ports.](http://guide.elm-lang.org/interop/javascript.html) 
- You can not use [Hot Module Replacement.](https://webpack.github.io/docs/hot-module-replacement.html)

Create Elm App adds a tool for optimizing production builds and running a development server with your app, which supports HMR.

All of that, combined with all the  basic functionality of [elm-platform](https://github.com/elm-lang/elm-platform) is bundled within a single command line tool, which you might use as a dependency or `eject` any time.

## Want a custom setup?

If you are a power user and you are not happy with the default configuration, you can `elm-app eject` anytime.

That way, you can use Create Elm App as a tool for boilerplate generation.

This operation will make changes to your project, which are hard to revert, if you will want to go back.

## Philosophy

Inspired by [create-react-app](https://github.com/facebookincubator/create-react-app)

* **One Dependency:** There is just one build dependency. It uses  Elm Platform, Webpack and other amazing projects, but provides a cohesive curated experience on top of them.

* **Zero Configuration:** There are no configuration files or command line options. Configuring both development and production builds is handled for you so you can focus on writing code.

* **No Lock-In:** You can “eject” to a custom setup at any time. Run a single command, and all the configuration and build dependencies will be moved directly into your project, so you can pick up right where you left off.

## What is inside
This tool contains a local installation of [elm-platform](https://github.com/elm-lang/elm-platform) and heavily relies on [webpack](https://github.com/webpack/webpack) in the build process.

## Alternatives
- [elm-webpack-starter](https://github.com/moarwick/elm-webpack-starter)
- [elm-app-boilerplate](https://github.com/gkubisa/elm-app-boilerplate)
- [elm-hot-loader-starter](https://github.com/fluxxu/elm-hot-loader-starter)
- [elm-starter](https://github.com/splodingsocks/elm-starter)
- [elm-live](https://github.com/tomekwi/elm-live)
- [generator-elmlang](https://github.com/Gizra/generator-elmlang)
