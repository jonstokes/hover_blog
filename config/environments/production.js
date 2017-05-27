const express = require('express')
const historyApiFallback = require('connect-history-api-fallback')

const relayServer = express()
const port = process.env.WEB_PORT || 3000

module.exports = {
  relay: {
    server: relayServer,
    port: port,
    endpoint: '/',
    middleware:  [ historyApiFallback() ]
  }
}
