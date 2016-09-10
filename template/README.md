This project was bootstrapped with [Create Elm App](https://github.com/halfzebra/create-elm-app).

Below you will find some information on how to perform common tasks.  
You can find the most recent version of this guide [here](https://github.com/halfzebra/create-elm-app/blob/master/template/README.md).

## Table of Contents
- [Available scripts](#available-scripts)
  - [elm-app build](#elm-app-build)
  - [elm-app start](#elm-app-start)
  - [elm-app eject](#elm-app-eject)
  - [elm-app package](#elm-app-package)
  - [elm-app repl](#elm-app-package)
  - [elm-app make](#elm-app-package)
  - [elm-app reactor](#elm-app-package)
- [IDE setup for Hot Module Replacement](#ide-setup-for-hot-module-replacement)

## Available scripts
In the project directory you can run:
### `elm-app build`
Builds the app for production to the `dist` folder.  

The build is minified and the filenames include the hashes.  
Your app is ready to be deployed!

### `elm-app start`
Runs the app in the development mode.  
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.  
You will also see any lint errors in the console.

### `elm-app eject`
**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Elm Platform, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

### `elm-app package`

## IDE setup for Hot Module Replacement
Remember to disable [safe write](https://webpack.github.io/docs/webpack-dev-server.html#working-with-editors-ides-supporting-safe-write) if you are using VIM or IntelliJ IDE, such as WebStrom.