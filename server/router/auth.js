const express = require('express')
const router = express.Router()
const passport = require('passport')
const { sendRes, auth, check, checkErrors } = require('../utilities/router')
const { Persona: User } = require('../models/persona')

// GET /auth/google
router.get(
  '/api/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
)

// GET /auth/google/callback
router.get(
  '/api/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function (_, res) {
    res.redirect('/trabajos')
  }
)

// POST auth/login {mail password}
router.post('/api/login', passport.authenticate('local'), function (req, res) {
  const user = req.user
  // res, status, data, message, error
  return sendRes(res, 200, user.toJSON(), 'Success', null)
})

// GET auth/logout
router.post('/api/logout', function (req, res) {
  req.logout()
  // res, status, data, message, error
  return sendRes(res, 200, null, 'Success', null)
})

// GET auth/me
router.get('/api/me', auth.isLogin, function (req, res) {
  // res, status, data, message, error
  return sendRes(res, 200, req.user.toJSON(), 'Success', null)
})

// POST auth/signup {Alta de un usuario}
router.post('/api/signup', function (req, res) {
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
        return sendRes(
          res,
          200,
          userDB.toJSON(),
          'User created with success',
          null
        )
      }
    })
  }
})

module.exports = router
