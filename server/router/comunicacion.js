import restify from 'express-restify-mongoose'
import { deleteProp, auth, block } from '../utilities/router'
import { Comunicacion } from '../models/comunicacion'

import router from './nuxtRouter'

restify.serve(router, Comunicacion, {
  preDelete: block,
  preUpdate: [deleteProp, auth.isLogin], // TODO: asolo las de el, delete to and form query porps
  preCreate: [auth.isLogin], // TODO: solo las de el
  preRead: [auth.isLogin], // TODO solo las de el
})

export default router
