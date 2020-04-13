const express = require('express')
const restify = require('express-restify-mongoose')
const router = express.Router()
const { deleteProp, block, auth, sendRes } = require('../utilities/router')
// const Batch = require("./../utilities/agendaTask");
const { Persona } = require('../models/persona')

/*
function isEmailUnique(req, res, next) {
  const entity = req.body
  const error = checkErrors([check(entity, 'email').isEmail()])
  if (error.length > 0) {
    return sendRes(res, 400, null, 'Body validation errors', error)
  } else {
    Persona.findOne({ email: entity.email, deleted: false }, (err, doc) => {
      if (err) {
        return sendRes(res, 500, null, 'error', err.message)
      } else if (!doc || doc._id.equals(entity._id)) {
        next()
      } else {
        return sendRes(
          res,
          400,
          null,
          'Bad request',
          'Ese email ya esta registrado.'
        )
      }
    })
  }
}
*/

restify.serve(router, Persona, {
  preDelete: [auth.isLogin], // TODO, solo borrar lo de el
  preUpdate: [
    deleteProp,
    auth.isLogin,
    (req, res, next) => {
      // const persona = req.erm.result
      const persona = req.body
      if (req.user._id.equals(persona._id)) {
        return next()
      } else {
        return sendRes(res, 401, null, 'Unauthorized', 'No tienes permiso')
      }
    },
  ],
  // postUpdate: [],
  preCreate: block,
  // postCreate: [],
  // preRead: [],
})

module.exports = router
