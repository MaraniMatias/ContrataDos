'use strict'
const fs = require('fs')
const path = require('path')
const consola = require('consola')

// Make dir to save file
const BASE_PATH = path.join(__dirname, '..', '..', 'static', 'images')
const PATH_IMAGE = ['perfil', 'jobs']

function start() {
  fs.mkdir(BASE_PATH, (err) => {
    if (err) consola.log(err.errno === -17 ? '/images dir created' : err)
    PATH_IMAGE.forEach((folder) => {
      fs.mkdir(path.join(BASE_PATH, folder), (err) => {
        if (err)
          consola.log(err.errno === -17 ? `/images/${folder} dir created` : err)
      })
    })
  })
}

function save(buffer, filePath) {
  return new Promise((resolve, reject) => {
    const imageBuffer = new Buffer.from(buffer)
    fs.writeFile(path.join(BASE_PATH, filePath), imageBuffer, function (err) {
      err ? reject(err) : resolve()
    })
  })
}

module.exports = {
  basePath: BASE_PATH,
  start,
  save,
}
