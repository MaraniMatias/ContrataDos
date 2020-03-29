const { block } = require('../utilities/router')
const { Provincia } = require('../models/provincia')

module.exports = (restify, router) => {
  restify.serve(router, Provincia, {
    preDelete: block,
    preUpdate: block,
    postUpdate: block,
    preCreate: block,
    postCreate: block,
    preRead: [],
  })
  return router
}
