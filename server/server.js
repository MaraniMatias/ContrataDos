const fs = require('fs')
const path = require('path')
const consola = require('consola')
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
  totalCountHeader: true,
  onError: (err, req, res) =>
    sendRes(res, req.erm.statusCode, null, 'Error', err.message, null),
})

// app.all('/api/v1/*', routAuth.isLogin) // Gran parate de la app es publica
// ------------------- Agregar routes ----------------------
// Inicializo las rutas
/*
app.use(require('./router/persona')(restify, router))
app.use(require('./router/provincia')(restify, router))
app.use(require('./router/localidad')(restify, router))
app.use(require('./router/agenda')(restify, router))
app.use(require('./router/trabajo')(restify, router))
*/
// ------------------- Agregar routes ----------------------

// Make dir to save file
const pathImage = ['perfil', 'jobs']
fs.mkdir(path.join(__dirname, 'images'), (err) => {
  if (err) consola.log(err.errno === -17 ? '/images dir created' : err)
  pathImage.forEach((folder) => {
    fs.mkdir(path.join(__dirname, 'images', folder), (err) => {
      if (err)
        consola.log(err.errno === -17 ? `/images/${folder} dir created` : err)
    })
  })
})

module.exports = app
