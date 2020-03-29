import express from 'express'
import restify from 'express-restify-mongoose'
const { block } = require('../utilities/router')
const { Localidad } = require('../models/localidad')

// Create express router
const router = express.Router()

restify.serve(router, Localidad, {
  preDelete: block,
  preUpdate: block,
  postUpdate: block,
  preCreate: block,
  postCreate: block,
  preRead: [],
})
export default router
