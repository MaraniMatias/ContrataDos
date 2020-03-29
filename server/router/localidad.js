const { block } = require('../utilities/router')
const { Localidad } = require('../models/localidad')

module.exports = (restify, router) => {
  restify.serve(router, Localidad, {
    preDelete: block,
    preUpdate: block,
    postUpdate: block,
    preCreate: block,
    postCreate: block,
    preRead: [],
  })
  return router
}
