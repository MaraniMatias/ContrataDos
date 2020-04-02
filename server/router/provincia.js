import restify from 'express-restify-mongoose'
import { block } from '../utilities/router'
import { Provincia } from '../models/provincia'

import router from './nuxtRouter'

restify.serve(router, Provincia, {
  preDelete: block,
  preUpdate: block,
  preCreate: block,
  preRead: [],
})
export default router
