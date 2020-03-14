const fs = require('fs')
const path = require('path')
const consola = require('consola')
const express = require('express')
const app = express()
const router = express.Router()
const bodyParser = require('body-parser')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const restify = require('express-restify-mongoose')
const pkg = require('../package.json')
const { passport } = require('./utilities/passport')
const { sendRes } = require('./utilities/router')
Object.assign = require('object-assign')

// Sobre escribe la informacion de las tecnologias usadas en backend
app.use(helmet())
app.use(helmet.xssFilter({ reportUri: '/report-xss-violation' }))

// Initialize Passport and restore authentication state, if any, from the session.
app.use(passport.initialize())
app.use(passport.session())

// Parsear el cueropo de dato en POST
app.use(bodyParser.json({ limit: '12mb' }))
app.use(bodyParser.urlencoded({ limit: '12mb', extended: true }))
app.use(cors({ exposedHeaders: ['X-Total-Count'] }))

restify.defaults({
  totalCountHeader: true,
  onError: (err, req, res) =>
    sendRes(res, req.erm.statusCode, null, 'Error', err.message, null)
})

// Lista las pediciones al servidor en consola
app.use(
  morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined', {
    skip: (_, res) =>
      process.env.NODE_ENV !== 'development' && res.statusCode < 400
  })
)

// app.all('/api/v1/*', routAuth.isLogin) // Gran parate de la app es publica
// ------------------- Agregar routes ----------------------
// Inicializo las rutas
app.use('/auth', require('./router/auth'))
app.use(require('./router/persona')(restify, router))
app.use(require('./router/provincia')(restify, router))
app.use(require('./router/localidad')(restify, router))
app.use(require('./router/agenda')(restify, router))
app.use(require('./router/trabajo')(restify, router))

// Static, FronEnd
app.use(express.static(path.join(__dirname, 'public')))
// ------------------- Agregar routes ----------------------

// Get /status
const date = new Date()
app.use('/api/status', function(req, res) {
  // const p = { pid: process.pid, ppid: process.ppid };
  res.json({
    server: process.env.NODE_ENV,
    uptime: process.uptime(),
    email: process.env.EMAIL_NOMBRE,
    // process: process.env.NODE_ENV === "development" ? p : {},
    version: `v${pkg.version}`,
    started: date.toString()
  })
})

// Error
/*
process.on("uncaughtException", function(err) {
  console.info(`This process is pid ${process.pid}`);
  console.info(`The parent process is pid ${process.ppid}`);
  console.error("Exception", err.stack);
});
*/

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
