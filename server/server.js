// require('dotenv-flow').config()
const path = require('path')
const bodyParser = require('body-parser')
const compress = require('compression')
const cors = require('cors')
const express = require('express')
const app = express()
const favicon = require('serve-favicon')
const helmet = require('helmet')
const restify = require('express-restify-mongoose')
const history = require('connect-history-api-fallback')
const auth = require('http-auth')
const statusMonitor = require('express-status-monitor')({
  path: '',
  title: 'Api Status',
})
const Routers = require('./router')
const passport = require('./utilities/passport')
const { sendRes } = require('./utilities/router')
Object.assign = require('object-assign')
const isProd = process.env.NODE_ENV === 'production'
const STATIC_PATH = isProd ? ['public'] : ['..', 'client', 'static']

const getPathPublicWith = (addPath) => {
  return path.join.apply(null, [__dirname, ...STATIC_PATH, addPath])
}

// Sobre escribe la informacion de las tecnologias usadas en backend
// FIXME: traee problemas al cargar nuxt
// app.use(helmet())
// app.use(helmet.contentSecurityPolicy())
app.use(helmet.dnsPrefetchControl())
app.use(helmet.expectCt())
app.use(helmet.frameguard())
app.use(helmet.hidePoweredBy())
app.use(helmet.hsts())
app.use(helmet.ieNoOpen())
app.use(helmet.noSniff())
app.use(helmet.permittedCrossDomainPolicies())
app.use(helmet.referrerPolicy())
app.use(helmet.xssFilter({ reportUri: '/report-xss-violation' }))
app.use(compress())

// Initialize Passport and restore authentication state, if any, from the session.
app.use(passport.initialize())
// app.all('/api/*', auth.isLogin)

// Parsear el cueropo de dato en POST
app.use(bodyParser.json(/* { limit: '12mb' } */))
app.use(bodyParser.urlencoded({ /*  limit: '12mb', */ extended: true }))
app.use(
  cors({
    origin: isProd ? process.env.FRONT_URL : true,
    exposedHeaders: ['X-Total-Count', 'Content-Type', 'Authorization'],
  })
)

// favicon
app.use(favicon(getPathPublicWith('favicon.ico')))
// Static, FronEnd
const staticMiddleware = express.static(
  path.join.apply(null, [__dirname, 'public'])
)
app.use(staticMiddleware)
const historyMiddleware = history({ disableDotRule: true, verbose: true })
app.use((req, res, next) => {
  // This is the ignore rule. You can do whatever checks you feel are necessary, e.g.
  // check headers, req path, external vars…
  if (/^\/api\/.*/.test(req.path)) {
    return next()
  }
  return historyMiddleware(req, res, next)
})
app.use(staticMiddleware)

// System monitor
const basic = auth.basic({ realm: 'API Monitor' }, function (user, pass, next) {
  next(
    user === process.env.API_STATUS_USER && pass === process.env.API_STATUS_PASS
  )
})
app.use(statusMonitor.middleware)
app.get('/api/status', basic.check(statusMonitor.pageRoute))

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
// app.all('/api/*', passport.authenticate('jwt', { session: false }))

module.exports = app
