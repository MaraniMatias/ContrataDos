import express from 'express'
import restify from 'express-restify-mongoose'
// const Batch = require("../utilities/agendaTask");
import { Agenda } from '../models/agenda'
import { deleteProp, block, auth } from '../utilities/router'

// Create express router
const router = express.Router()

restify.serve(router, Agenda, {
  preDelete: block,
  preUpdate: [auth.isLogin, deleteProp], // TODO, solo borrar lo de el
  postUpdate: [],
  preCreate: auth.isLogin, // TODO, solo borrar lo de el
  postCreate: [],
  preRead: auth.isLogin, // TODO, solo borrar lo de el
})
export default router
