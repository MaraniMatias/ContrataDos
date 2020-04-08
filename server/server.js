require('dotenv').config()
const path = require('path')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const passport = require('passport')
const cors = require('cors')
const helmet = require('helmet')
const restify = require('express-restify-mongoose')
const statusMonitor = require('express-status-monitor')
const favicon = require('serve-favicon')
const { sendRes } = require('./utilities/router')
const Routers = require('./router')
Object.assign = require('object-assign')
const STATIC_PATH = process.env.NODE_ENV === 'production' ? 'public' : 'static'

// Sobre escribe la informacion de las tecnologias usadas en backend
app.use(helmet())
app.use(helmet.xssFilter({ reportUri: '/report-xss-violation' }))

// Initialize Passport and restore authentication state, if any, from the session.
app.use(passport.initialize())
app.use(passport.session())
// app.all('/api/*', auth.isLogin)

// Parsear el cueropo de dato en POST
app.use(bodyParser.json(/* { limit: '12mb' } */))
app.use(bodyParser.urlencoded({ /*  limit: '12mb', */ extended: true }))
app.use(cors({ exposedHeaders: ['X-Total-Count'] }))

// favicon
app.use(favicon(path.join(__dirname, '..', STATIC_PATH, 'favicon.ico')))
// Static, FronEnd
app.use(express.static(path.join(__dirname, '..', STATIC_PATH)))

// System monitor
app.use(statusMonitor({ title: 'ContrataDos Status', path: '/api/status' }))

restify.defaults({
  prefix: '/api',
  version: '',
  totalCountHeader: true,
  // lean: false,
  runValidators: true,
  onError: (err, req, res) =>
    sendRes(res, req.erm.statusCode, null, 'Error', err.message, null),
})

// Agregar routes
Routers.setTo(app)

module.exports = app
