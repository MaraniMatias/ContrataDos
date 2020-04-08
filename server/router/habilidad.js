const express = require('express')
const restify = require('express-restify-mongoose')
const router = express.Router()
const { block } = require('../utilities/router')
const { Habilidad } = require('../models/habilidad')

restify.serve(router, Habilidad, {
  preDelete: block,
  preUpdate: block,
  preCreate: block,
  preRead: [],
})

module.exports = router

/*
import baseApi from '~/api/baseApi'
const h = baseApi('/Habilidad')

h.save({ nombre: 'Profesor', descripcion: 'descripcion para Profesor' })
h.save({ nombre: 'Plomero', descripcion: 'descripcion para Plomero' })
h.save({ nombre: 'Electricista', descripcion: 'descripcion para Electricista' })
h.save({ nombre: 'Niñera', descripcion: 'descripcion para Niñera' })
*/
