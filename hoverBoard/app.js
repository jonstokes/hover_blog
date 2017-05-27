const express = require('express')
//const session = require('express-session')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const uuid = require('node-uuid')
const path = require('path')
const chalk = require('chalk')
const _ = require('lodash')
const fs = require('fs')
const request = require('request')

const Logger = require.main.require('./../hoverBoard/logger')

module.exports = class App {
  constructor({ secret, relay, api }) {
    this.secret = secret
    this.relay = relay
    this.api = api

    this.middleware()
    this.routing()

    this.listen = this.listen.bind(this)
  }

  middleware() {
    const { relay, api } = this
    const accessLogStream = fs.createWriteStream(`log/${process.env.NODE_ENV}.log`, {flags: 'a'})

    // Logging
    relay.server.use(morgan('combined', {stream: accessLogStream}))

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
    relay.server.use('/', express.static(path.join(__dirname, '../build')))

    // Load environment-specific middleware
    relay.middleware.forEach((el) => { relay.server.use(el) })

    // Set up api proxy endpoints
    api.endpoints.forEach((endpoint) => {
      relay.server.use(endpoint, function(req, res) {
        var url = `${api.serverUrl}:${api.port}` + req.url;
        req.pipe(request(url)).pipe(res);
      });
    })
  }

  routing() {
    // Add any declared routes here
  }

  listen() {
    const { relay } = this

    return relay.server.listen(relay.port, () =>
      console.log(chalk.green(`Relay is listening on port ${relay.port}`))
    );

  }
}
