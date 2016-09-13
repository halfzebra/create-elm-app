const { expect }  = require('chai');
const spawn = require('cross-spawn');

describe('Create Elm App', function() {
  describe('Create Elm App global CLI', function() {
    expect(() => spawn.sync('create-elm-app')).to.not.throw(Error);
  });
});
