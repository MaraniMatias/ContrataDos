const express = require('express')
const restify = require('express-restify-mongoose')
const router = express.Router()
const { Agenda } = require('../utilities/agenda')
const sendEmailNuevoMensaje = require('../utilities/agenda/send_email_nuevo_mensaje.job')
const { deleteProp, auth, block } = require('../utilities/router')
const { Comunicacion } = require('../models/comunicacion')
const { Persona } = require('../models/persona')

restify.serve(router, Comunicacion, {
  preDelete: block,
  preUpdate: [deleteProp, auth.isLogin], // TODO: asolo las de el, delete to and form query porps
  preCreate: [auth.isLogin], // TODO: solo las de el
  postCreate: [
    async (req, _, next) => {
      try {
        const message = req.erm.result
        const { to, trabajo: trabajoId } = message
        const person = await Persona.findById(to)
        if (!person) return next()
        sendEmailNuevoMensaje.jobCreate(Agenda, {
          email: person.email,
          link: process.env.FRONT_URL + '/trabajos/' + trabajoId,
        })
        return next()
      } catch (err) {
        return next(err)
      }
    },
  ],
  preRead: [auth.isLogin], // TODO solo las de el
})

module.exports = router
