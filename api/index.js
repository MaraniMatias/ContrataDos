import express from 'express'
const passport = require('passport')
const User = require('./../server/models/persona')
const { sendRes } = require('./../server/utilities/router')
const { routAuth } = require('./../server/utilities/passport')
const { checkErrors, check } = require('./../server/utilities/checkProps')

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

// Add POST - /api/logout
router.post('/logout', (req, res) => {
  delete req.session.authUser
  res.json({ ok: true })
})

// GET /auth/google
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
)

// GET /auth/google/callback
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function (req, res) {
    const user = req.user
    req.session.authUser = user
    res.redirect('/trabajos')
  }
)

// POST auth/login {mail password}
router.post('/login', passport.authenticate('local'), function (req, res) {
  const user = req.user
  req.session.authUser = user
  // res, status, data, message, error
  return sendRes(res, 200, user, 'Success', null)
})

// GET auth/logout
router.get('/logout', function (req, res) {
  delete req.session.authUser
  req.logout()
  // res, status, data, message, error
  return sendRes(res, 200, null, 'Success', null)
})

// GET auth/me
router.get('/me', routAuth.isLogin, function (req, res) {
  // res, status, data, message, error
  return sendRes(res, 200, req.user, 'Success', null)
})

// POST auth/signup {Alta de un usuario}
router.post('/signup', routAuth.isLogin, function (req, res) {
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

// Export the server middleware
export default {
  path: '/api/auth',
  handler: router,
}
