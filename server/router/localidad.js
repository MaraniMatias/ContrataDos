import express from 'express'
import restify from 'express-restify-mongoose'
import { block } from '../utilities/router'
import { Localidad } from '../models/localidad'

// Create express router
const router = express.Router()

restify.serve(router, Localidad, {
  preDelete: block,
  preUpdate: block,
  preCreate: block,
  preRead: [],
})
export default router
