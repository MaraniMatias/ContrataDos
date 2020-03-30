'use strict'
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
module.exports = function (res, cod = 200, data, message = '', error = null) {
  res.status(cod)
  return res.json({ data, message, error })
}
