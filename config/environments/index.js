/* eslint-disable global-require */
const _ = require('lodash')
const devServer = require.main.require('../hoverBoard/devServer')

const webPort = process.env.WEB_PORT || 3000
const apiPort = process.env.API_PORT || 3001

const config = {
  env: process.env.NODE_ENV || 'development',
  secret: process.env.SECRET || 'dev_secret',
  relay: {
    server: devServer(),
    port: webPort,
    endpoint: '/',
    middleware: []
  },
  api: {
    serverUrl: 'http://localhost',
    port: apiPort,
    endpoints: {
      graphQL: '/graphQL',
      login: '/login'
      logout: '/logout'
    }
  }
}

module.exports = _.extend(config, require(`./${config.env}`).default) // eslint-disable-line

