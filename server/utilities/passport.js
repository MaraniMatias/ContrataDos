const SECRET_KEY_SESSION = process.env.SECRET_KEY_SESSION || 'C0n7r47a2_hola:D'
const passport = require('passport')
const passportJWT = require('passport-jwt')
const LocalStrategy = require('passport-local').Strategy
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy
// const { PersonaRol: Rol, Persona } = require("./../models/persona");
const { Persona } = require('./../models/persona')

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
        console.log({ googleToken: accessToken, profile: profile._json })
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
        if (err || !userDb) {
          return done(err, null)
        } else {
          return done(err, userDb)
        }
      })
    }
  )
)

passport.use(
  new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    function (email, password, next) {
      Persona.findOne({ email, deleted: false, estado: 'HABILITADO' }).exec(
        function (err, user) {
          if (err || !user) {
            return next(err, false)
          } else {
            if (user.authenticate(password)) {
              return next(null, user)
            }
            return next(null, false)
          }
        }
      )
    }
  )
)

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
        .populate('municipio')
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

passport.serializeUser(function (user, cb) {
  if (process.env.NODE_ENV === 'development') {
    console.log('serializeUser', user.email)
  }
  cb(null, user._id)
})

passport.deserializeUser(function (id, cb) {
  if (process.env.NODE_ENV === 'development') console.log('deserializeUser', id)
  Persona.findById(id, function (err, user) {
    if (process.env.NODE_ENV === 'development' && user) {
      console.log(user._id, user.roles)
    }
    cb(err, user)
  })
})

// Validad roles
const authorization = {
  isLogin: [
    (req, _, next) => {
      const id =
        req.session && req.session.passport && req.session.passport.user
      if (process.env.NODE_ENV === 'development' && id) {
        console.log('serializeUser', id)
      }

      if (id) {
        Persona.findById(id, function (err, user) {
          if (err) next(false)
          req.user = user
          next()
        })
      } else {
        next()
      }
    },
  ],
}

module.exports = {
  passport,
  routAuth: authorization,
}
