const express = require('express')
const flash = require('connect-flash')
const session = require('express-session')
const morgan = require('morgan')
const graphQLHTTP = require('express-graphql')
const bodyParser = require('body-parser')
const uuid = require('node-uuid')
const passport = require('passport')
const Strategy = require('passport-local').Strategy
const path = require('path')
const chalk = require('chalk')
const _ = require('lodash')
const fs = require('fs')

const Logger = require('./logger')
const schema = require('config/schema')
const db = require('db/database').db

module.exports = class App {
  constructor({ secret, relay, graphQL }) {
    this.secret = secret
    this.relay = relay
    this.graphQL = graphQL

    this.middleware()
    this.passport()
    this.routing()

    this.listen = this.listen.bind(this)
  }

  middleware() {
    const { relay, graphQL } = this
    const accessLogStream = fs.createWriteStream(`log/${process.env.NODE_ENV}.log`, {flags: 'a'})

    // Logging
    relay.server.use(morgan('combined', {stream: accessLogStream}))

    // Load shared middleware
    relay.server.use(bodyParser.json()) // for parsing application/json
    relay.server.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
    relay.server.use(session({
      resave: true,
      saveUninitialized: true,
      genid: (req) => uuid.v4(),
      secret: this.secret
    }))
    relay.server.use('/', express.static(path.join(__dirname, '../build')))

    // Prepare passport middelware
    relay.server.use(flash())
    relay.server.use(passport.initialize());
    relay.server.use(passport.session());

    // Load environment-specific middleware
    relay.middleware.forEach((el) => { relay.server.use(el) })

    // Set up graphql
    graphQL.server.use(graphQL.endpoint, graphQLHTTP((req) => {
      const context = { user: req.user, session: req.session }

      return _.extend(graphQL.requestOptions, { schema, context})
    }))
  }

  passport() {
    const { relay } = this

    passport.use(new Strategy({
        passReqToCallback : true,
        usernameField: 'email',
        passwordField: 'password'
      },
      (req, username, password, done) => {
        const user = db.getUser('1')
        Logger.log('Local strategy returning user', user)
        return done(null, user)
      }
    ))

    passport.serializeUser((user, done) => {
      return done(null, user.id)
    })

    passport.deserializeUser((id, done) => {
      return done(null, db.getUser(id))
    })

    relay.server.use('/login', passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/login',
      failureFlash: true
    }))
  }

  routing() {
    // Add any declared routes here
  }

  listen() {
    const { relay, graphQL } = this

    // If the graphql server is on a separate port, make it listen on that port.
    if (graphQL.port && (graphQL.port != relay.port)) {
      graphQL.server.listen(graphQL.port, () =>
        console.log(chalk.green(`GraphQL is listening on port ${graphQL.port}`))
      );
    }

    return relay.server.listen(relay.port, () =>
      console.log(chalk.green(`Relay is listening on port ${relay.port}`))
    );

  }
}
