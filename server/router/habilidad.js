import express from 'express'
import restify from 'express-restify-mongoose'
import { block } from '../utilities/router'
import { Habilidad } from '../models/habilidad'

// Create express router
const router = express.Router()

restify.serve(router, Habilidad, {
  preDelete: block,
  preUpdate: block,
  preCreate: block,
  preRead: [],
})
export default router
