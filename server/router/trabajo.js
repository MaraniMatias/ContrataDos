import restify from 'express-restify-mongoose'
import { deleteProp, auth } from '../utilities/router'
// const Batch = require("../utilities/agendaTask");
import { Trabajo, TipoTrabajo } from '../models/trabajo'

import router from './nuxtRouter'

restify.serve(router, Trabajo, {
  preDelete: auth.isLogin,
  // TODO, solo borrar lo de el
  preUpdate: [auth.isLogin, deleteProp], // TODO, solo borrar lo de el
  postUpdate: [],
  preCreate: [
    auth.isLogin,
    deleteProp,
    (req, _, next) => {
      const body = req.body
      body.cliente = req.user._id
      return next()
    },
  ],
  postCreate: [],
  preRead: [
    auth.setUser,
    (req, _, next) => {
      const { query } = req.erm.query
      const $or = query.$or || []
      const profesional = query.profesional || ($or[0] && $or[0].profesional)
      const cliente = query.cliente || ($or[1] && $or[1].cliente)
      // console.log('·---===#0#==---·')
      // console.log('0->', query)
      // console.log('0-> isAuser', req.user && req.user._id)
      // console.log('0-> prof clie', profesional, cliente)

      if (typeof req.user === 'undefined' || (!profesional && !cliente)) {
        query.tipo = TipoTrabajo.PUBLICO
        return next()
      }
      if (req.user._id.equals(profesional) && req.user._id.equals(cliente)) {
        return next()
      }
      if (!cliente && profesional && req.user._id.equals(profesional)) {
        return next()
      }
      if (!profesional && cliente && req.user._id.equals(cliente)) {
        return next()
      }

      query.tipo = TipoTrabajo.PUBLICO
      return next()
    },
  ],
})

export default router
