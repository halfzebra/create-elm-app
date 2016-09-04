# Elm App CLI

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

This will create a new folder with required files for your future project.

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

### `elm-app build`

## Guide

[readme](template/README.md)

## Philosophy

Inspired by [create-react-app](https://github.com/facebookincubator/create-react-app)

* **One Dependency:** There is just one build dependency. It uses  Elm Platform, Webpack and other amazing projects, but provides a cohesive curated experience on top of them.

* **Zero Configuration:** There are no configuration files or command line options. Configuring both development and production builds is handled for you so you can focus on writing code.

* **No Lock-In:** You can “eject” to a custom setup at any time. Run a single command, and all the configuration and build dependencies will be moved directly into your project, so you can pick up right where you left off.

### Alternatives
- [elm-webpack-starter](https://github.com/moarwick/elm-webpack-starter)
- [elm-app-boilerplate](https://github.com/gkubisa/elm-app-boilerplate)
- [elm-hot-loader-starter](https://github.com/fluxxu/elm-hot-loader-starter)
- [elm-starter](https://github.com/splodingsocks/elm-starter)
- [elm-live](https://github.com/tomekwi/elm-live)
- [generator-elmlang](https://github.com/Gizra/generator-elmlang)