import express from 'express'
import restify from 'express-restify-mongoose'
import { deleteProp, auth } from '../utilities/router'
// const Batch = require("../utilities/agendaTask");
import { Trabajo } from '../models/trabajo'

// Create express router
const router = express.Router()

restify.serve(router, Trabajo, {
  preDelete: auth.isLogin, // TODO, solo borrar lo de el
  preUpdate: [auth.isLogin, deleteProp], // TODO, solo borrar lo de el
  postUpdate: [],
  preCreate: auth.isLogin, // TODO, solo borrar lo de el
  postCreate: [],
  preRead: auth.isLogin, // TODO, solo borrar lo de el
})
export default router
