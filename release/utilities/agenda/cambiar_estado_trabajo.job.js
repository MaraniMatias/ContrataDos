const { Trabajo } = require('../../models/trabajo')
// let Agenda

module.exports.autoStart = false
module.exports.jobCreate = (agenda, schedule, data) => {
  // Agenda = agenda
  agenda.schedule(schedule, this.name, data)
}

// Export params to define a job
module.exports.name = 'CAMBIAR_ESTADO_TRABAJO'
module.exports.options = { priority: 'lowest', concurrency: 2 }

// Export job or task
module.exports.job = async (job) => {
  const { _id, estado } = job.attrs.data
  await Trabajo.findByIdAndUpdate(_id, { estado })
}
