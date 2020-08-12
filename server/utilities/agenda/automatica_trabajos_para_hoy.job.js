const { Trabajo, EstadoTrabajo } = require('../../models/trabajo')
const sendEmailTrabajosParaHoy = require('../agenda/send_email_trabajos_para_hoy.job')
const cambiarEstadoTrabajo = require('../agenda/cambiar_estado_trabajo.job')
const dateFormat = require('./../dateFormat')
const camelCase = require('./../capitalizeWords')
let Agenda

module.exports.autoStart = true
module.exports.jobCreate = (agenda, data) => {
  Agenda = agenda

  const isProd = process.env.NODE_ENV === 'production'
  const times = isProd ? '1 days' : '20 minutes'

  agenda
    .create(this.name, data)
    .repeatEvery(times, { skipImmediate: isProd })
    .save()
}

// Export params to define a job
module.exports.name = 'AUTOMATICA_TRABAJOS_PARA_HOY'
module.exports.options = { priority: 'low', concurrency: 1 }

// Export job or task
module.exports.job = async () => {
  console.log('informar de los trabajos para hoy')
  const trabajosList = await Trabajo.find({
    estado: EstadoTrabajo.PENDIENTE,
    deleted: false,
  })
    .populate('profesional')
    .populate('cliente')
    .where('agenda.fecha_inicio')
    .gte(new Date().setHours(0, 0, 0, 0))
    .where('agenda.fecha_inicio')
    .lt(new Date().setHours(59, 59, 59, 0))

  const orderList = groupByAndFilter(trabajosList)
  console.log('Para hoy %s trabajos', orderList.length)
  Object.values(orderList).forEach(({ profesional, jobs }) => {
    const data = []
    jobs.forEach((job) => {
      cambiarEstadoTrabajo.jobCreate(Agenda, getAgenda(job).fecha_inicio, {
        _id: job._id,
        estado: EstadoTrabajo.EN_PROGRESO,
      })
      const smailJob = getUtilDate(job)
      data.push(smailJob)
      // Para el cliente
      if (job.cliente && job.cliente.notification) {
        const email = job.cliente.email
        if (email) {
          sendEmailTrabajosParaHoy.jobCreate(Agenda, { email, data })
        }
      }
    })
    // Para el profesional
    if (profesional && profesional.notification) {
      const email = profesional.email
      if (email) {
        sendEmailTrabajosParaHoy.jobCreate(Agenda, { email, data })
      }
    }
  })
}

function getAgenda(job) {
  const agendaIndex = job.agenda.length - 1
  return job.agenda[agendaIndex]
}
function getUtilDate(job) {
  const hours = getAgenda(job).fecha_inicio
  return {
    link: process.env.FRONT_URL + '/trabajos/' + job._id,
    descripcion: job.descripcion_breve,
    fecha: camelCase(dateFormat(hours, "EEEE dd/MM 'a las' HH:mm 'hs'")),
  }
}

function getDayOfYear(now) {
  const start = new Date(now.getFullYear(), 0, 0)
  const diff =
    now -
    start +
    (start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000
  const oneDay = 1000 * 60 * 60 * 24
  return Math.floor(diff / oneDay)
}

function groupByAndFilter(trabajosList) {
  const jobByProfession = {
    /* [_id]: {
     *  profesional: {},
     *  jobs: []
     * }
     */
  }
  Object.defineProperty(jobByProfession, 'length', {
    value: 0,
    enumerable: false,
    writable: true,
  })

  const lt = getDayOfYear(new Date().setHours(0, 0, 0, 0))
  trabajosList.forEach((trabajo) => {
    const key = trabajo.profesional._id
    const gte = getAgenda(trabajo).fecha_inicio.getTime()
    if (getDayOfYear(gte) == lt) {
      jobByProfession.length = jobByProfession.length + 1
      if (typeof jobByProfession[key] === 'undefined') {
        jobByProfession[key] = {
          profesional: trabajo.profesional,
          jobs: [trabajo],
        }
      } else {
        jobByProfession[key].jobs.push(trabajo)
      }
    }
  })
  return jobByProfession
}
