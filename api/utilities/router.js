'use strict'
const get = require('./get')
/**
 * sendRes
 *
 * Solo con el objetivo de enviar siempre una misma respuesta
 * @param {expressResponse} res
 * @param {String} cod Response Status Cod
 * @param {any} data Response Data
 * @param {String} message Response Message
 * @param {String} error Response Error
 * @returns {Object} {data, message, error}
 */
const sendRes = function (res, cod = 200, data, message = '', errors = null) {
  res.status(cod)
  return res.json({ data, message, errors })
}

/**
 * Normalizar parametros para el paginado
 *
 * @param  {} req
 * @param  {} res
 * @param  {} next
 */
const queryPage = (req, _, next) => {
  // en caso de no estar definido se fuersa a 0
  const skip = get(req, 'query.skip', 0)
  // en caso de no estar definido se fuersa a 15
  let limit = get(req, 'query.limit', 15)
  limit = parseInt(limit, 10)
  req.query.skip = parseInt(skip, 10)
  req.query.limit = limit > 0 ? limit : 15
  // Continuar con la consulta ala API
  next()
}

const deleteProp = function (req, _, next) {
  const entity = req.body
  // delete entity.deleted;
  delete entity.createdAt
  delete entity.__v
  entity.updatedAt = new Date()
  if (req.user) {
    entity.updatedBy = req.user._id
  }
  if (entity.deleted) {
    entity.deletedBy = req.user._id
  }
  // delete muni.updatedAt;
  next()
}

const block = function (req, res, next) {
  next(false)
}

module.exports = {
  queryPage,
  sendRes,
  deleteProp,
  block,
}
