/* eslint-disable no-console, no-shadow */

const config = require.main.require('../config/environments/index')
const App = require.main.require('./app')

const app = new App(config)

app.listen()