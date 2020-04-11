const fs = require('fs')
const path = require('path')
const mongoose = require('mongoose')
const Agenda = require('agenda')
let agenda

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

module.exports.start = async function () {
  try {
    agenda = new Agenda({ mongo: mongoose.connection })

    // Auto load task
    fs.readdirSync(__dirname)
      .filter((fileName) => /^.+\.job\.js$/.test(fileName))
      .map((fileName) => {
        const { name, job, options } = require(path.join(__dirname, fileName))
        console.log('Load Agenda job', name, 'in', fileName)
        const agendaOptions = options || { priority: 'normal', concurrency: 2 }
        agenda.define(name, agendaOptions, job)
      })

    await agenda.start()
  } catch (e) {
    console.error('Error al cargar agenda')
  }
}

module.exports.Agenda = agenda
