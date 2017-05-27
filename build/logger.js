'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var chalk = require('chalk');
var fs = require('fs');

var Logger = function () {
  function Logger() {
    _classCallCheck(this, Logger);
  }

  _createClass(Logger, [{
    key: 'logLine',
    value: function logLine(label, input, output) {
      var line = chalk.dim('[' + Date.now() + ']') + ('  ' + chalk.blue(label)); // eslint-disable-line prefer-template

      if (typeof input !== 'undefined') {
        if (typeof input === 'string') {
          line = line.concat(': \n' + input);
        } else {
          line = line.concat(': ' + JSON.stringify(input));
        }
      }

      if (typeof output !== 'undefined') {
        if (typeof output === 'string') {
          line = line.concat('\n' + chalk.green(output));
        } else {
          line = line.concat(' => ' + chalk.green(JSON.stringify(output)));
        }
      }

      return line;
    }
  }, {
    key: 'log',
    value: function log(label, input, output) {
      var fileName = 'log/' + process.env.NODE_ENV + '.log';
      var line = this.logLine(label, input, output) + '\n';

      fs.appendFileSync(fileName, line, function (err) {
        fs.writeFile(fileName, line);
      });
    }
  }, {
    key: 'print',
    value: function print(label, input, output) {
      console.log(this.logLine(label, input, output)); // eslint-disable-line no-console
      this.log(label, input, output);
    }
  }]);

  return Logger;
}();

module.exports = new Logger();