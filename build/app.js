'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var express = require('express');
//const session = require('express-session')
var morgan = require('morgan');
var bodyParser = require('body-parser');
var uuid = require('node-uuid');
var path = require('path');
var chalk = require('chalk');
var _ = require('lodash');
var fs = require('fs');
var request = require('request');

var Logger = require.main.require('./../hoverBoard/logger');

module.exports = function () {
  function App(_ref) {
    var secret = _ref.secret,
        relay = _ref.relay,
        api = _ref.api;

    _classCallCheck(this, App);

    this.secret = secret;
    this.relay = relay;
    this.api = api;

    this.middleware();
    this.routing();

    this.listen = this.listen.bind(this);
  }

  _createClass(App, [{
    key: 'middleware',
    value: function middleware() {
      var relay = this.relay,
          api = this.api;

      var accessLogStream = fs.createWriteStream('log/' + process.env.NODE_ENV + '.log', { flags: 'a' });

      // Logging
      relay.server.use(morgan('combined', { stream: accessLogStream }));

      /* This stuff may not work with the proxy
      // Load shared middleware
      relay.server.use(bodyParser.json()) // for parsing application/json
      relay.server.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
      relay.server.use(session({
        resave: true,
        saveUninitialized: true,
        genid: (req) => uuid.v4(),
        secret: this.secret
      }))
      */
      relay.server.use('/', express.static(path.join(__dirname, '../build')));

      // Load environment-specific middleware
      relay.middleware.forEach(function (el) {
        relay.server.use(el);
      });

      // Set up api proxy endpoints
      api.endpoints.forEach(function (endpoint) {
        relay.server.use(endpoint, function (req, res) {
          var url = api.serverUrl + ':' + api.port + req.url;
          req.pipe(request(url)).pipe(res);
        });
      });
    }
  }, {
    key: 'routing',
    value: function routing() {
      // Add any declared routes here
    }
  }, {
    key: 'listen',
    value: function listen() {
      var relay = this.relay;


      return relay.server.listen(relay.port, function () {
        return console.log(chalk.green('Relay is listening on port ' + relay.port));
      });
    }
  }]);

  return App;
}();