import express from 'express'
import restify from 'express-restify-mongoose'
const { deleteProp } = require('../utilities/router')
// const Batch = require("../utilities/agendaTask");
const { Trabajo } = require('../models/trabajo')
const { routAuth } = require('../utilities/passport')

// Create express router
const router = express.Router()

restify.serve(router, Trabajo, {
  preDelete: routAuth.isLogin, // TODO, solo borrar lo de el
  preUpdate: [routAuth.isLogin, deleteProp], // TODO, solo borrar lo de el
  postUpdate: [],
  preCreate: routAuth.isLogin, // TODO, solo borrar lo de el
  postCreate: [],
  preRead: routAuth.isLogin, // TODO, solo borrar lo de el
})
export default router
