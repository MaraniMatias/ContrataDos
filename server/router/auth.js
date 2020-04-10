const express = require('express')
const router = express.Router()
const passport = require('passport')
const bcrypt = require('bcrypt')
const saltRounds = 10
const { sendRes, auth, check, checkErrors } = require('../utilities/router')
const { Persona: User } = require('../models/persona')
const emailTokenSecret = 'QdVYGl3pXU562loudRC3_QTP'
const Agenda = require('../utilities/agendaTask')

function sendVerifyEmail(email) {
  return new Promise(function (resolve, reject) {
    bcrypt
      .hash(email + emailTokenSecret, saltRounds)
      .catch(reject)
      .then((token) => {
        Agenda.jobCreate(Agenda.jobs.SEND_EMAIL.VERIFICAR_EAMIL, {
          email,
          link: `${process.env.BASE_URL}/login?token=${token}&email=${email}`,
        })
        resolve()
      })
  })
}

// GET /api/auth/google
router.get(
  '/api/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  })
)

// GET /api/auth/google/callback
router.get(
  '/api/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: process.env.URL + '/login?error=google_token',
    // sauccessRedirect: '/me',
  }),
  function (req, res) {
    const token = passport.setTokeTo(res, { value: req.user._id })
    res.redirect(process.env.URL + '/login?token=' + token)
    // res.redirect('back')
    // res, status, data, message, error
    // return sendRes(res, 200, req.user.toJSON(), 'Success', null)
  }
)

// POST /api/auth/login {mail password}
router.post(
  '/api/auth/login',
  passport.authenticate('local', { session: false }),
  (req, res) => {
    if (req.user.email_verified) {
      passport.setTokeTo(res, { value: req.user._id })
      // res, status, data, message, error
      return sendRes(res, 200, req.user, 'Success', null)
    } else {
      return sendRes(res, 200, req.user, 'Success', 'Email is not verified')
    }
  }
)

// GET api/auth/logout
router.post('/api/auth/logout', function (req, res) {
  req.logout()
  // res, status, data, message, error
  return sendRes(res, 200, null, 'Success', null)
})

// POST /api/auth/signup {Alta de un usuario}
router.post('/api/auth/signup', async function (req, res) {
  const errors = checkErrors([
    check(req.body, 'apellido').isString(),
    check(req.body, 'email').isEmail(),
    check(req.body, 'nombre').isString(),
    check(req.body, 'password').isPassword(),
  ])
  if (errors.length > 0) {
    return sendRes(res, 400, null, 'Body validation errors', errors)
  }
  try {
    const user = new User({
      apellido: req.body.apellido,
      email: req.body.email,
      nombre: req.body.nombre,
      password: req.body.password,
      role: req.body.role,
      // picture: '/avatars/matthew.png',
    })
    const userDB = await user.save()
    await sendVerifyEmail(userDB.email)
    return sendRes(res, 200, null, 'User created, check your email', null)
  } catch (err) {
    if (err.code === 11000) {
      return sendRes(res, 400, null, 'Error', 'Email ya registrado.')
    } else {
      return sendRes(res, 500, null, 'Error saving new user', err)
    }
  }
})

// GET api/auth/singh/verification?token&email
router.get('/api/auth/singh/verification', async function (req, res) {
  try {
    const { token, email } = req.query
    const password = email + emailTokenSecret
    if (await bcrypt.compare(password, token)) {
      const user = await User.findOne({ email, email_verified: false })
      user.email_verified = true
      await user.save()
      // res, status, data, message, error
      return sendRes(res, 200, user, 'Success', null)
    } else {
      return sendRes(res, 404, null, 'page not found', null)
    }
  } catch (err) {
    return sendRes(res, 500, null, 'Error saving new user', err)
  }
})

router.post('/api/auth/sendemail', function (req, res) {
  const errors = checkErrors([check(req.body, 'email').isEmail()])
  if (errors.length > 0) {
    return sendRes(res, 400, null, 'Body validation errors', errors)
  }
  return sendVerifyEmail(req.body.email)
    .then(() => {
      return sendRes(res, 200, null, 'Success', null)
    })
    .catch((err) => {
      return sendRes(res, 500, null, 'Error saving new user', err)
    })
})

// GET api/auth/me
router.get('/api/auth/me', auth.isLogin, function (req, res) {
  // res, status, data, message, error
  return sendRes(res, 200, req.user.toJSON(), 'Success', null)
})

module.exports = router
