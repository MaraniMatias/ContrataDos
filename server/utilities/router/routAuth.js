const consola = require('consola')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const { Persona } = require('./../../models/persona')
const sendRes = require('./sendRes')

// Config passport
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/google/callback',
    },
    function (accessToken, refreshToken, profile, done) {
      if (process.env.NODE_ENV === 'development') {
        consola.log({ googleToken: accessToken, profile: profile._json })
      }
      const email = profile._json.email
      const user = {
        nombre: profile.name.givenName,
        apellido: profile.name.familyName,
        googleId: profile.id,
        email,
        picture: profile._json.picture,
        google_account: {
          id: profile.id,
          _json: profile._json,
          accessToken,
          refreshToken,
        },
        // other
        gender: profile.gender,
        organizations: profile._json.organizations,
      }
      Persona.findOrCreate({ email }, user, (err, userDb) => {
        if (err || !userDb) return done(err, null)
        else return done(err, userDb)
      })
    }
  )
)

passport.use(
  new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    async function (email, password, next) {
      try {
        // TODO Caundoe este armado el enpoint para singin corregir esto
        const user = await Persona.findOne({ email, deleted: false })
          .populate('servicios')
          .populate('localidad')

        if (!user) {
          const persona = new Persona({
            nombre: 'matthew',
            apellido: 'local',
            email,
            password,
            picture: '/avatars/matthew.png',
          })
          const userDB = await persona.save()
          return next(null, userDB)
        } else {
          if (await user.authenticate(password)) return next(null, user)
          return next(null, false)
        }
      } catch (err) {
        return next(err, false)
      }
    }
  )
)

/*
passport.use(
  new JwtStrategy(
    {
      // Creates a new extractor that looks for the JWT in the authorization header with the scheme 'bearer'
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: SECRET_KEY_SESSION,
      ignoreExpiration: process.env.NODE_ENV === 'development',
    },
    function (jwtPayload, next) {
      // console.log("payload received", jwt_payload);
      // usually this would be a database call:
      Persona.findById(jwtPayload.id)
        .select('-password') // Selecciona todos los campos menos password
        .exec(function (err, user) {
          if (err || !user) {
            return next(err, false)
          }
          return next(null, user)
        })
    }
  )
)
*/

passport.serializeUser(function (user, cb) {
  if (process.env.NODE_ENV === 'development') {
    consola.log('serializeUser', user.email)
  }
  cb(null, user._id)
})

// Validad roles
const authorization = {
  setUser: (req, res, next) => {
    // TODO save jwt or create un token
    const id = req.session && req.session.passport && req.session.passport.user
    if (process.env.NODE_ENV === 'development' && id) {
      consola.log('serializeUser', id)
    }
    if (!id) return next()
    Persona.findById(id)
      .populate('servicios')
      .populate('localidad')
      .exec(function (err, user) {
        if (err || !user) {
          return sendRes(res, err ? 500 : 404, null, 'Error')
        } else {
          req.user = user
          return next()
        }
      })
  },
  isLogin: (req, res, next) => {
    if (req.user) {
      return next()
    } else {
      return sendRes(res, 401, null, 'Unauthorized', 'No tienes permiso')
    }
  },
}

module.exports = authorization
