import express from 'express'
import restify from 'express-restify-mongoose'
import { deleteProp, block, auth } from '../utilities/router'
// const { checkErrors, check } = require('../utilities/checkProps')
// const Batch = require("./../utilities/agendaTask");
import { Persona } from '../models/persona'

// Create express router
const router = express.Router()

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
  preDelete: auth.isLogin, // TODO, solo borrar lo de el
  preUpdate: [deleteProp],
  postUpdate: [],
  preCreate: block,
  postCreate: block,
  preRead: [
    function (req, _, next) {
      req.query.select = '-password'
      if (!req.erm.query) req.erm.query = {}
      if (!req.erm.query.select) req.erm.query.select = {}
      req.erm.query.select.password = 0
      next()
    },
  ],
})

export default router
