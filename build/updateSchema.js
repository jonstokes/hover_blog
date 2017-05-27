'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var updateSchema = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
    var json;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return (0, _graphql.graphql)(_schema2.default, _utilities.introspectionQuery);

          case 3:
            json = _context.sent;

            _fs2.default.writeFileSync(jsonFile, JSON.stringify(json, null, 2));
            _fs2.default.writeFileSync(graphQLFile, (0, _utilities.printSchema)(_schema2.default));
            console.log(_chalk2.default.green('Schema has been regenerated'));
            _context.next = 12;
            break;

          case 9:
            _context.prev = 9;
            _context.t0 = _context['catch'](0);

            console.error(_chalk2.default.red(_context.t0.stack));

          case 12:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 9]]);
  }));

  return function updateSchema() {
    return _ref.apply(this, arguments);
  };
}();

// Run the function directly, if it's called from the command line


var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _graphql = require('graphql');

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _utilities = require('graphql/utilities');

var _schema = require('../server/config/schema');

var _schema2 = _interopRequireDefault(_schema);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; } /* eslint-disable no-console */


var jsonFile = _path2.default.join(__dirname, './../server/config/schema.json');
var graphQLFile = _path2.default.join(__dirname, './../server/config/schema.graphql');

if (!module.parent) updateSchema();

exports.default = updateSchema;