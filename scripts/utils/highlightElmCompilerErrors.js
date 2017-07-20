'use strict';

var chalk = require('chalk');

module.exports = function highlightElmCompilerErrors(messages) {
  var errors = messages.errors;
  var warnings = messages.warnings;
  return errors.length > 0
    ? {
        errors: errors.map(x =>
          x
            .replace(/(--\s[A-Z\s]+-+\s.*\.elm\n)/g, chalk.cyan('$1'))
            .replace(/(\n\s*)(\^+)/g, '$1' + chalk.red('$2'))
            .replace(/(\d+\|)(>)/g, '$1' + chalk.bold(chalk.red('$2')))
        ),
        warnings: warnings
      }
    : messages;
};
