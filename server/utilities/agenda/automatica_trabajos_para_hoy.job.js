const sendEmailTo = require('../emails/send')

module.exports.jobCreate = (agenda, data) =>
  agenda.create(this.name, data).save()

// Export params to define a job
module.exports.name = 'AUTOMATICA_TRABAJOS_PARA_HOY'
module.exports.options = {}

// Export job or task
module.exports.job = async (job) => {
  console.log('informar de los trabajos para hoy, y cambiarlos de estado??')
  await sendEmailTo(
    { subject: 'Trabajos para HOY', template: 'list_jobs_today.pug' },
    job.attrs.data
  )
}
