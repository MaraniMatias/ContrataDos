const mongoose = require('mongoose')
const Agenda = require('agenda')
let agenda

// Auto load Tasks
/*
module.exports.jobs = {
  SEND_EMAIL: {
    VERIFICAR_EAMIL: 'SEND_EMAIL_VERIFICAR_EAMIL',
    NUEVA_CONSULTA: 'NUEVA_CONSULTA',
    NUEVO_MENSAJE: 'NUEVO_MENSAJE',
    CITA_ACEPTADA: 'CITA_ACEPTADA',
    CLASIFICAR_TRABAJO: 'CLASIFICAR_TRABAJO',
    TRABAJO_CANCELADO: 'TRABAJO_CANCELADO',
  },
  AUTOMATICA: {
    TRABAJOS_PARA_HOY: 'TRABAJOS_PARA_HOY',
  },
}
*/

module.exports.jobCreate = (jobName, data) =>
  agenda.create(jobName, data).save()

module.exports.start = async function () {
  try {
    agenda = new Agenda({ mongo: mongoose.connection })

    // Auto load task
    /*
    agenda.define(
      this.jobs.SEND_EMAIL.VERIFICAR_EAMIL,
      { priority: 'normal', concurrency: 2 },
      async (job) => {
        await sendEmailTo(
          { subject: 'Bienvenido', template: 'new_user.pug' },
          job.attrs.data
        )
      }
    )
    */

    await agenda.start()
  } catch (e) {
    console.error('Error al cargar agenda')
  }
}
