import express from 'express'
import restify from 'express-restify-mongoose'
const { block } = require('../utilities/router')
const { Provincia } = require('../models/provincia')

// Create express router
const router = express.Router()

restify.serve(router, Provincia, {
  preDelete: block,
  preUpdate: block,
  postUpdate: block,
  preCreate: block,
  postCreate: block,
  preRead: [],
})
export default router
