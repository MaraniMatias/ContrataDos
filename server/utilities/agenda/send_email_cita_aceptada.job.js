const sendEmailTo = require('../emails/send')

module.exports.jobCreate = (agenda, data) =>
  agenda.create(this.name, data).save()

// Export params to define a job
module.exports.name = 'SEND_EMAIL_CITA_ACEPTADA'
module.exports.options = {}

// Export job or task
module.exports.job = async (job) => {
  await sendEmailTo(
    { subject: 'Fecha acordada', template: 'job_date_accepted.pug' },
    job.attrs.data
  )
}
