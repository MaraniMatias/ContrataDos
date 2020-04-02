import restify from 'express-restify-mongoose'
import { block } from '../utilities/router'
import { Localidad } from '../models/localidad'

import router from './nuxtRouter'

restify.serve(router, Localidad, {
  preDelete: block,
  preUpdate: block,
  preCreate: block,
  preRead: [],
})
export default router
