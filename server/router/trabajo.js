const express = require('express')
const restify = require('express-restify-mongoose')
const router = express.Router()
const { Agenda } = require('../utilities/agenda')
const sendEmailNuevaConsulta = require('../utilities/agenda/send_email_nueva_consulta.job')
const sendEmailTrabajoCancelado = require('../utilities/agenda/send_email_trabajo_cancelado.job')
const sendEmailCitaAceptada = require('../utilities/agenda/send_email_cita_aceptada.job')
const sendEmailClasificarTrabajo = require('../utilities/agenda/send_email_clasificar_trabajo.job')
const dateFormat = require('../utilities/dateFormat')
const { deleteProp, auth } = require('../utilities/router')
// const Batch = require("../utilities/agendaTask");
const { Trabajo, EstadoTrabajo } = require('../models/trabajo')
const { Persona } = require('../models/persona')
const camelCase = require('./../utilities/capitalizeWords')
const getLink = (_id) => process.env.FRONT_URL + '/trabajos/' + _id

restify.serve(router, Trabajo, {
  preDelete: auth.isLogin, // TODO, solo borrar lo de el
  preUpdate: [auth.isLogin, deleteProp], // TODO, solo borrar lo de el
  postUpdate: [
    // Emails and notification
    async (req, _, next) => {
      const trabajo = req.erm.result
      const { profesional, cliente } = trabajo

      const isNewState = (check) => {
        return req.body.oldEstado !== check && req.body.estado === check
      }

      const _id = trabajo.profesional._id || trabajo.profesional
      const sendEmailToId = req.user._id.equals(_id) ? cliente : profesional
      const person = await Persona.findById(
        sendEmailToId._id || sendEmailToId
      ).select({ email: 1, notification: 1 })

      if (!person || !person.notification) {
        return next()
      } else if (isNewState(EstadoTrabajo.CANCELADO)) {
        sendEmailTrabajoCancelado.jobCreate(Agenda, {
          email: person.email,
          descripcion: trabajo.descripcion_breve,
          link: getLink(trabajo._id),
        })
        return next()
      } else if (isNewState(EstadoTrabajo.PENDIENTE)) {
        const agendaIndex = trabajo.agenda.length - 1
        const hours = trabajo.agenda[agendaIndex].fecha_inicio
        sendEmailCitaAceptada.jobCreate(Agenda, {
          email: person.email,
          descripcion: trabajo.descripcion_breve,
          fecha: camelCase(dateFormat(hours, "EEEE dd/MM 'a las' HH:mm 'hs'")),
          link: getLink(trabajo._id),
        })
        return next()
      } else if (isNewState(EstadoTrabajo.TERMINADO)) {
        sendEmailClasificarTrabajo.jobCreate(Agenda, {
          email: person.email,
          descripcion: trabajo.descripcion_breve,
          link: getLink(trabajo._id),
        })
        return next()
      } else {
        return next()
      }
    },
  ],
  preCreate: [
    auth.isLogin,
    deleteProp,
    (req, _, next) => {
      const body = req.body
      body.cliente = req.user._id
      return next()
    },
  ],
  postCreate: [
    (req, _, next) => {
      const trabajo = req.erm.result
      sendEmailNuevaConsulta.jobCreate(Agenda, {
        email: req.body.profesional.email, // TODO usar el id y buscar el email
        link: process.env.FRONT_URL + '/trabajos/' + trabajo._id,
      })
      return next()
    },
  ],
  preRead: [
    (req, _, next) => {
      console.log(req.erm.query, req.user)
      /*
      const { query } = req.erm.query
      const $or = query.$or || []
      const profesional = query.profesional || ($or[0] && $or[0].profesional)
      const cliente = query.cliente || ($or[1] && $or[1].cliente)
      // console.log('·---===#0#==---·')
      // console.log('0->', query)
      // console.log('0-> isAuser', req.user && req.user._id)
      // console.log('0-> prof clie', profesional, cliente)

      if (typeof req.user === 'undefined' || (!profesional && !cliente)) {
        query.tipo = TipoTrabajo.PUBLICO
        return next()
      }
      if (req.user._id.equals(profesional) && req.user._id.equals(cliente)) {
        return next()
      }
      if (!cliente && profesional && req.user._id.equals(profesional)) {
        return next()
      }
      if (!profesional && cliente && req.user._id.equals(cliente)) {
        return next()
      }

      query.tipo = TipoTrabajo.PUBLICO
      */
      return next()
    },
  ],
  // postRead: [(req, _, next) => {}],
})

/*
router.get('/api/custom/trabajo/score', auth.isLogin, async (req, res) => {
  try {
    // TODO aggregate
    const trabajosTerminados = await Trabajo.find({
      profesional: req.user._id,
      estado: EstadoTrabajo.TERMINADO,
    })
    const data = {
      count: trabajosTerminados.length,
      like: trabajosTerminados.filter((jobs) => jobs.like).length,
      dontLike: trabajosTerminados.filter((jobs) => jobs.dontLike).length,
    }
    return sendRes(res, 200, data, 'success', null)
  } catch (err) {
    return sendRes(res, 500, null, 'error', err)
  }
})
*/

module.exports = router
