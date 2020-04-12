const fs = require('fs')
const path = require('path')
const mongoose = require('mongoose')
const Agenda = require('agenda')

module.exports.Agenda = new Agenda({ mongo: mongoose.connection })

module.exports.start = async function () {
  try {
    const agenda = this.Agenda

    // Auto load task
    fs.readdirSync(__dirname)
      .filter((fileName) => /^.+\.job\.js$/.test(fileName))
      .map((fileName) => {
        const { name, job, options } = require(path.join(__dirname, fileName))
        console.log('Load Agenda job', name)
        const agendaOptions = options || { priority: 'normal', concurrency: 2 }
        agenda.define(name, agendaOptions, job)
      })

    await this.Agenda.start()
  } catch (e) {
    console.error('Error al cargar agenda')
  }
}
