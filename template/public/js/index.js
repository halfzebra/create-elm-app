import '../css/main.css';

const logoPath = require('../media/logo.svg');
const Elm = require('../../src/App.elm');

const root = document.getElementById('root');

Elm.App.embed(root, logoPath)
