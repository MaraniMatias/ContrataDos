import express from 'express'
const passport = require('passport')
const { Persona: User } = require('../models/persona')
const { sendRes } = require('../utilities/router')
const { routAuth } = require('../utilities/passport')
const { checkErrors, check } = require('../utilities/checkProps')

// Create express router
const router = express.Router()

// Transform req & res to have the same API as express
// So we can use res.status() & res.json()
const app = express()
router.use((req, res, next) => {
  Object.setPrototypeOf(req, app.request)
  Object.setPrototypeOf(res, app.response)
  req.res = res
  res.req = req
  next()
})
router.use(routAuth.isLogin)

// GET /auth/google
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
)

// GET /auth/google/callback
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function (_, res) {
    res.redirect('/trabajos')
  }
)

// POST auth/login {mail password}
router.post('/login', passport.authenticate('local'), function (req, res) {
  const user = req.user
  // res, status, data, message, error
  return sendRes(res, 200, user, 'Success', null)
})

// GET auth/logout
router.post('/logout', function (req, res) {
  req.logout()
  // res, status, data, message, error
  return sendRes(res, 200, null, 'Success', null)
})

// GET auth/me
router.get('/me', routAuth.isLogin, function (req, res) {
  /*
  if (req.user?._id) return sendRes(res, 200, req.user, 'Success', null)
  else return sendRes(res, 404, {}, 'Error', null)
  */
  // res, status, data, message, error
  return sendRes(res, 200, req.user, 'Success', null)
})

// POST auth/signup {Alta de un usuario}
router.post('/signup', function (req, res) {
  const errors = checkErrors([
    check(req.body, 'apellido').isString(),
    check(req.body, 'email').isEmail(),
    check(req.body, 'nombre').isString(),
    check(req.body, 'password').isPassword(),
  ])
  if (errors.length > 0) {
    return sendRes(res, 400, null, 'Body validation errors', errors)
  } else {
    const user = new User({
      apellido: req.body.apellido,
      email: req.body.mail,
      nombre: req.body.nombre,
      password: req.body.password,
      role: req.body.role,
    })
    user.save(function (err, userDB) {
      if (err || !userDB) {
        return sendRes(res, 500, null, 'Error saving new user', err)
      } else {
        return sendRes(res, 200, userDB, 'User created with success', null)
      }
    })
  }
})

export default router
