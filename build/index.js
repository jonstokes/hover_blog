'use strict';

/* eslint-disable no-console, no-shadow */

var config = require.main.require('../config/environments/index');
var App = require.main.require('./app');

var app = new App(config);

app.listen();