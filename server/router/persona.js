import restify from 'express-restify-mongoose'
import { deleteProp, block, auth, sendRes } from '../utilities/router'
// const { checkErrors, check } = require('../utilities/checkProps')
// const Batch = require("./../utilities/agendaTask");
import { Persona } from '../models/persona'
import router from './nuxtRouter'

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
    auth.setUser,
    (req, res, next) => {
      // const persona = req.erm.result
      const persona = req.body
      if (!req.user._id.equals(persona._id)) {
        return sendRes(res, 401, null, 'Unauthorized', 'No tienes permiso')
      }
      return next()
    },
  ],
  // postUpdate: [],
  preCreate: block,
  // postCreate: [],
  preRead: [
    function (req, _, next) {
      const { query } = req.erm.query
      query.select = '-password'
      if (!query) req.erm.query = {}
      if (!query.select) query.select = {}
      query.select.password = 0
      return next()
    },
  ],
})

export default router

/*
router.get('/search', async function (req, res) {
  console.log(req.query) // plomero + casilda
  const query = 'profesor en casida' //  y plomero en rosario'
  console.log(query)

  // TODO, Servicio, localidad, bilbiografia, nombre, apellido, razon_social
  const search = await User.find({ tags: { $in: tokenizer.tokenize(query) } })

  // -----------------
  const source = 'Soy profesor y plomero, realizo trabajos en casilda y zona'
  const target = 'plomero en casilda'
  console.log(natural.LevenshteinDistance(source, target))
  console.log(natural.LevenshteinDistance(source, 'profesor en rosario'))
  console.log(natural.LevenshteinDistance(source, 'profesor'))

  // res, status, data, message, error
  return sendRes(res, 200, search, 'Success', null)
})
import natural from 'natural'
import { Habilidad } from '../models/habilidad'
import { Location } from '../models/localidad'
const tokenizer = new natural.AggressiveTokenizerEs()
        // TODO filtar solo profeciones, y localidades
        const biblo = tokenizer.tokenize(persona.bibliography)
        const tags = new Set(biblo)
        tags.add(persona.nombre)
        tags.add(persona.apellido)
        tags.add(persona.email)
        tags.add(persona.razon_social)
        // const servicios = await Habilidad.find({_id:persona.servicios})
        // tags.add() // add habilidades
        const servicios = await Location.findById(persona.localidad)
        tags.add(servicios) // add localidad
        persona.tags = Array.from(tags)
*/
