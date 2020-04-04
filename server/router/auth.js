import passport from 'passport'
import { sendRes, auth } from '../utilities/router'
import { checkErrors, check } from '../utilities/checkProps'
import router from './nuxtRouter'
const { Persona: User, PersonaRol } = require('../models/persona')

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
    if (user.roles.includes(PersonaRol.PROFECIONAL)) res.redirect('/trabajos')
    else res.redirect('/')
  }
)

// POST auth/login {mail password}
router.post('/login', passport.authenticate('local'), function (req, res) {
  const user = req.user
  // res, status, data, message, error
  return sendRes(res, 200, user.toJSON(), 'Success', null)
})

// GET auth/logout
router.post('/logout', function (req, res) {
  req.logout()
  // res, status, data, message, error
  return sendRes(res, 200, null, 'Success', null)
})

// GET auth/me
router.get('/me', auth.isLogin, function (req, res) {
  // res, status, data, message, error
  return sendRes(res, 200, req.user.toJSON(), 'Success', null)
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

export default router
