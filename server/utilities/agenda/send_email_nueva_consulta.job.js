const sendEmailTo = require('../emails/send')

module.exports.jobCreate = (agenda, data) =>
  agenda.create(this.name, data).save()

// Export params to define a job
module.exports.name = 'SEND_EMAIL_NUEVA_CONSULTA'
module.exports.options = {}

// Export job or task
module.exports.job = async (job) => {
  await sendEmailTo(
    { subject: 'Cambio de contraseña', template: 'new_pass_user.pug' },
    job.attrs.data
  )
}
