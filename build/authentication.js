'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createAnonymousUser = createAnonymousUser;
exports.decodeToken = decodeToken;
exports.hasAuthorization = hasAuthorization;
exports.createToken = createToken;
exports.createAnonymousToken = createAnonymousToken;
exports.authenticateUser = authenticateUser;

var _environment = require('config/environment');

var _environment2 = _interopRequireDefault(_environment);

var _logger = require('utils/logger');

var _logger2 = _interopRequireDefault(_logger);

var _database = require('db/database');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Users
var ANONYMOUS_TOKEN_DATA = {
  id: 'anonymous',
  role: _environment2.default.roles.anonymous
};

function createAnonymousUser() {
  // For now, because Chrome sucks, just use jstokes:
  return Database.getUser('1');
  // return new User(
  //   ANONYMOUS_TOKEN_DATA.id,
  //   '',
  //   '',
  //   '',
  //   '',
  //   ANONYMOUS_TOKEN_DATA.role
  // )
}

function decodeToken(token) {
  return jwt.verify(token, _environment2.default.secret);
}

function findUserFromTokenData(tokenData) {
  return new Promise(function (resolve) {
    var user = void 0;

    if (tokenData.id === 'anonymous') {
      user = createAnonymousUser();
    } else {
      user = Database.getUser(tokenData.id);
    }
    _logger2.default.print('findUserFromTokenData', tokenData, user);
    resolve(user);
  });
}

function loadSessionData(req) {
  var sessionData = void 0;
  if (req.session && req.session.token) {
    sessionData = new Promise(function (resolve) {
      var tokenData = null;
      try {
        tokenData = decodeToken(req.session.token);
      } catch (err) {
        _logger2.default.print(err);
      }
      _logger2.default.print('loadSessionData', req.session, tokenData);
      resolve(tokenData);
    });
  } else {
    sessionData = new Promise(function (resolve) {
      _logger2.default.print('loadSessionData', req.session);
      resolve(null);
    });
  }
  return sessionData;
}

function hasAuthorization(actualRole, expectedRole, next) {
  if (actualRole === expectedRole) {
    return next();
  } else {
    // eslint-disable-line no-else-return
    return function () {
      return null;
    };
  }
}

// Tokens
function createToken(userData) {
  var token = void 0;

  if (userData && userData.id) {
    var id = userData.id,
        role = userData.role;

    token = jwt.sign({ id: id, role: role }, _environment2.default.secret);
  } else {
    token = jwt.sign(ANONYMOUS_TOKEN_DATA, _environment2.default.secret);
  }
  _logger2.default.print('createToken', userData, token);
  return token;
}

function createAnonymousToken() {
  return createToken();
}

function authenticateUser(req, res, next) {
  _logger2.default.print('authenticateUser', req.session);
  loadSessionData(req).then(function (tokenData) {
    if (!tokenData) {
      req.user = createAnonymousUser(); // eslint-disable-line no-param-reassign
      req.session.token = createAnonymousToken(); // eslint-disable-line no-param-reassign
      next();
    } else {
      findUserFromTokenData(tokenData).then(function (user) {
        if (!user) {
          res.sendStatus(404);
        } else {
          req.user = user; // eslint-disable-line no-param-reassign
        }
        next();
      });
    }
  }).catch(function (err) {
    _logger2.default.print('authenticateUser Error', req.session, err);
    res.sendStatus(400);
  });
}