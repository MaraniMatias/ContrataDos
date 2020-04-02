import restify from 'express-restify-mongoose'
import { deleteProp, auth } from '../utilities/router'
// const Batch = require("../utilities/agendaTask");
import { Trabajo, TipoTrabajo } from '../models/trabajo'

import router from './nuxtRouter'

restify.serve(router, Trabajo, {
  preDelete: auth.isLogin, // TODO, solo borrar lo de el
  preUpdate: [auth.isLogin, deleteProp], // TODO, solo borrar lo de el
  postUpdate: [],
  preCreate: auth.isLogin,
  postCreate: [],
  preRead: [
    (req, _, next) => {
      const query = req.query
      if (
        typeof req.user === 'undefined' ||
        req.user._id !== query.profesional
      ) {
        query.tipo = TipoTrabajo.PUBLICO
      }
      return next()
    },
  ],
})

export default router
