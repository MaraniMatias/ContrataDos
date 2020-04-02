const path = require('path')
const express = require('express')
const app = express()
// const router = express.Router()
// const cors = require('cors')
const helmet = require('helmet')
const restify = require('express-restify-mongoose')
const statusMonitor = require('express-status-monitor')
const favicon = require('serve-favicon')
const { sendRes } = require('./utilities/router')
Object.assign = require('object-assign')

// Sobre escribe la informacion de las tecnologias usadas en backend
app.use(helmet())
app.use(helmet.xssFilter({ reportUri: '/report-xss-violation' }))

// favicon
app.use(favicon(path.join(__dirname, '../static', 'favicon.ico')))

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

module.exports = app
