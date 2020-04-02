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

/*
import baseApi from '~/api/baseApi'
const h = baseApi('/Habilidad')

h.save({ nombre: 'Profesor', descripcion: 'descripcion para Profesor' })
h.save({ nombre: 'Plomero', descripcion: 'descripcion para Plomero' })
h.save({ nombre: 'Electricista', descripcion: 'descripcion para Electricista' })
h.save({ nombre: 'Niñera', descripcion: 'descripcion para Niñera' })
*/
export default router
