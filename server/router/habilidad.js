import restify from 'express-restify-mongoose'
import { block } from '../utilities/router'
import { Habilidad } from '../models/habilidad'

import router from './nuxtRouter'

restify.serve(router, Habilidad, {
  preDelete: block,
  preUpdate: block,
  preCreate: block,
  preRead: [],
})
export default router
