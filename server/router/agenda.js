import restify from 'express-restify-mongoose'
// const Batch = require("../utilities/agendaTask");
import { Agenda } from '../models/agenda'
import { deleteProp, block, auth } from '../utilities/router'

import router from './nuxtRouter'

restify.serve(router, Agenda, {
  preDelete: block,
  preUpdate: [auth.isLogin, deleteProp], // TODO, solo borrar lo de el
  postUpdate: [],
  preCreate: auth.isLogin, // TODO, solo borrar lo de el
  postCreate: [],
  preRead: auth.isLogin, // TODO, solo borrar lo de el
})
export default router
