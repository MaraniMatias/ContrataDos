import express from 'express'
import restify from 'express-restify-mongoose'
import { block } from '../utilities/router'
import { Provincia } from '../models/provincia'

// Create express router
const router = express.Router()

restify.serve(router, Provincia, {
  preDelete: block,
  preUpdate: block,
  preCreate: block,
  preRead: [],
})
export default router
