const { Trabajo } = require('../../models/trabajo')
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
    // agenda: { fecha_inicio: { $gt: new Date().setHours(0, 0, 0, 0) } },
  })
    .populate('profesional', 'email')
    .populate('cliente', 'email') // TODO al cliente tambien le avisamos

  const orderList = groupBy(trabajosList)
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

function getUtilDate(job) {
  // const agendaIndex = job.agenda.length - 1
  // const hours = job.agenda[agendaIndex].fecha_inicio
  const hours = job.createdAt
  return {
    link: process.env.FRONT_URL + '/trabajos/' + job._id,
    descripcion: job.descripcion_breve,
    fecha: camelCase(dateFormat(hours, "EEEE dd/MM 'a las' HH:mm 'hs'")),
  }
}

function groupBy(trabajosList) {
  const jobByProfession = {
    /* [_id]: {
     *  profesional: {},
     *  jobs: []
     * }
     */
  }
  trabajosList.forEach((trabajo) => {
    const key = trabajo.profesional._id
    if (typeof jobByProfession[key] === 'undefined') {
      jobByProfession[key] = {
        profesional: trabajo.profesional,
        jobs: [trabajo],
      }
    } else {
      jobByProfession[key].jobs.push(trabajo)
    }
  })
  return jobByProfession
}
