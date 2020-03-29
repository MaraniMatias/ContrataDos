const fs = require('fs')
const path = require('path')
const consola = require('consola')
const mongoose = require('mongoose')
mongoose.Promise = global.Promise
const { Nuxt, Builder } = require('nuxt')
const config = require('../nuxt.config.js')
const getMongoURL = require('./utilities/getMongoURL')
const getLocalIP = require('./utilities/getLocalIP')
// const Agenda = require("./utilities/agendaTask");

// Import and Set Nuxt.js options
const app = require('./server')
config.dev = process.env.NODE_ENV !== 'production'

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

async function start() {
  // MongoDB connect
  const mongoURL = getMongoURL()
  consola.log('MongoDB URL', mongoURL)
  const mongooseOptions = {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
  }

  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const { host, port } = nuxt.options.server

  await nuxt.ready()
  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  // Give nuxt middleware to express
  app.use(nuxt.render)

  mongoose.connect(mongoURL, mongooseOptions, (err) => {
    if (err) {
      consola.error('Error al conectar a la base de datos: ' + err)
      process.exit()
    } else {
      consola.log(`Conexón establecida con '${mongoose.connections[0].name}'`)
      // Listen the server
      app.listen(port, host, () => {
        getLocalIP()
        consola.ready({
          message: `Server listening on http://${host}:${port}`,
          badge: true,
        })
      })
    }
  })
}
start()
