const express = require('express')
const restify = require('express-restify-mongoose')
const router = express.Router()
const { deleteProp, auth, block } = require('../utilities/router')
const { Comunicacion } = require('../models/comunicacion')

restify.serve(router, Comunicacion, {
  preDelete: block,
  preUpdate: [deleteProp, auth.isLogin], // TODO: asolo las de el, delete to and form query porps
  preCreate: [auth.isLogin], // TODO: solo las de el
  preRead: [auth.isLogin], // TODO solo las de el
})

module.exports = router
