'use strict'
const router = require('express').Router()
const passport = require('passport')
const jwt = require('jsonwebtoken')
const User = require('../models/persona')
const { routAuth, secretKeySession } = require('./../utilities/passport')
const { sendRes } = require('./../utilities/router')
const { checkErrors, check } = require('./../utilities/checkProps')

// GET /auth/google
// router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// GET /auth/google/callback
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function (req, res) {
    // TODO pensar el flujo
    const user = req.user
    user.password = null // Avoid sending password encryption
    const token = jwt.sign({ id: req.user._id }, secretKeySession)
    const data = { user, token }
    // res, status, data, message, error
    return sendRes(res, 200, data, 'Success', null)
  }
)

// POST auth/login {mail password}
// curl 'http://192.168.1.6:3000/auth/login' -H 'content-type: application/json' --data '{"mail":"maranimatias@gmail.com","password":"qwertY12"}'
router.post('/login', passport.authenticate('local'), function (req, res) {
  const token = jwt.sign({ id: req.user._id }, secretKeySession)
  const data = { user: req.user, token }
  // res, status, data, message, error
  return sendRes(res, 200, data, 'Success', null)
})

// GET auth/logout
router.get('/logout', function (req, res) {
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
      mail: req.body.mail,
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

module.exports = router
