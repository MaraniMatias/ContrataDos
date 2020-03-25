const path = require('path')
const nodemailer = require('nodemailer')
const pug = require('pug')
const options = {
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_AUTH_USER,
    pass: process.env.EMAIL_AUTH_PASS,
  },
  email_no_replay:
    process.env.EMAIL_NOMBRE + ' <' + process.env.EMAIL_AUTH_USER + '>',
  logo: process.env.EMAIL_LOGO,
}
if (process.env.NODE_ENV !== 'production') console.log(options)
const templeteUserABM = pug.compileFile(
  path.join(__dirname, 'templates', 'email_abm_usuario.pug')
)
const templeteAplicacion = pug.compileFile(
  path.join(__dirname, 'templates', 'aplicacion_change.pug')
)

module.exports = async function ({ subject, type }, data) {
  const sendEmailTo = data.email || data.sendEmailTo
  if (process.env.NODE_ENV !== 'production') {
    console.log("sendMail '" + subject + "' to", sendEmailTo)
  }
  // Generate test SMTP service account from ethereal.email
  await nodemailer.createTestAccount()
  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport(options)

  // create reusable transporter object using the default SMTP transport
  // transporter.verify(function(error, success) {
  //   if (error) console.log(error);
  //   else console.log("Server is ready to take our messages", success);
  // });

  await transporter.sendMail({
    from: options.email_no_replay,
    to: process.env.EMAIL_DEFAULT || sendEmailTo,
    bcc:
      process.env.NODE_ENV === 'production'
        ? process.env.EMAIL_AUTH_USER
        : undefined,
    subject,
    html:
      type === 'user_abm'
        ? templeteUserABM({ data, subject, logo: options.logo })
        : templeteAplicacion({ data, subject, logo: options.logo, type }),
  })
}
