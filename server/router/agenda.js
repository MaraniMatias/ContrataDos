import express from 'express'
import restify from 'express-restify-mongoose'
const { deleteProp, block } = require('../utilities/router')
// const Batch = require("../utilities/agendaTask");
const { Agenda } = require('../models/agenda')
const { routAuth } = require('../utilities/passport')

// Create express router
const router = express.Router()

restify.serve(router, Agenda, {
  preDelete: block,
  preUpdate: [routAuth.isLogin, deleteProp], // TODO, solo borrar lo de el
  postUpdate: [],
  preCreate: routAuth.isLogin, // TODO, solo borrar lo de el
  postCreate: [],
  preRead: routAuth.isLogin, // TODO, solo borrar lo de el
})
export default router
