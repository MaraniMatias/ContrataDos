const { Trabajo, EstadoTrabajo } = require('../../models/trabajo')
const sendEmailTrabajosParaHoy = require('../agenda/send_email_trabajos_para_hoy.job')
const dateFormat = require('./../dateFormat')
const camelCase = require('./../capitalizeWords')
let Agenda

module.exports.autoStart = true
module.exports.jobCreate = (agenda, data) => {
  Agenda = agenda
  agenda.create(this.name, data).repeatEvery('1 days').save()
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
    .populate('profesional', 'email')
    .populate('cliente', 'email')
    .where('agenda.fecha_inicio')
    .gte(new Date().setHours(0, 0, 0, 0))
    .where('agenda.fecha_inicio')
    .lt(new Date().setHours(0, 0, 0, 0))

  const orderList = groupByAndFilter(trabajosList)
  Object.values(orderList).forEach(({ profesional, jobs }) => {
    const data = []
    jobs.forEach((job) => {
      const smailJob = getUtilDate(job)
      data.push(smailJob)
      // Para el cliente
      if (job.cliente) {
        const email = job.cliente.email
        if (email) {
          sendEmailTrabajosParaHoy.jobCreate(Agenda, { email, data })
        }
      }
    })
    // Para el profesional
    if (profesional) {
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

function groupByAndFilter(trabajosList) {
  const jobByProfession = {
    /* [_id]: {
     *  profesional: {},
     *  jobs: []
     * }
     */
  }
  trabajosList.forEach((trabajo) => {
    const key = trabajo.profesional._id
    const gte = new Date(getAgenda(trabajo).fecha_inicio).getTime()
    const lt = new Date().setHours(0, 0, 0, 0).getTime()
    if (gte >= lt) {
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
