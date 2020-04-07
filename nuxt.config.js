require('dotenv').config()
const session = require('express-session')
const bodyParser = require('body-parser')
const passport = require('passport')

module.exports = {
  mode: 'universal',
  env: {
    BASE_URL: process.env.BASE_URL || 'http://localhost:3000',
  },
  serverMiddleware: [
    // Initialize Passport and restore authentication state, if any, from the session.
    passport.initialize(),
    passport.session(),
    // Parsear el cueropo de dato en POST
    bodyParser.json({ limit: '12mb' }),
    bodyParser.urlencoded({ limit: '12mb', extended: true }),
    // session middleware
    session({
      secret: process.env.SECRET_KEY_SESSION || 'secretK3y',
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 60000 },
    }),
    { path: '/api/auth', handler: '~/server/router/auth' },
    { path: '/api/file', handler: '~/server/router/file' },
    // { path: '/api', handler: '~/server/router/search' },
    '~/server/router/comunicacion',
    '~/server/router/habilidad',
    '~/server/router/localidad',
    '~/server/router/persona',
    '~/server/router/provincia',
    '~/server/router/trabajo',
  ],
  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: '',
    title: 'ContrataDos',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#086b94' },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    { src: '~/plugins/tiptapVuetify', mode: 'client' },
    { src: '~/plugins/notify', mode: 'client' },
    './plugins/globalComponents',
    './plugins/axion',
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    '@nuxtjs/vuetify',
    // ['@nuxtjs/dotenv', { filename: '.env.prod' }],
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    '@nuxtjs/pwa',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
    [
      'nuxt-social-meta',
      {
        url: 'contratados.com',
        title: 'ContrataDos',
        description: 'Encuentra un profesional',
        img: '/assets/logo.png',
        locale: 'es_ES',
        twitter: '@maranimaitas',
        themeColor: '#086b94',
      },
    ],
    'nuxt-compress',
    'nuxt-material-design-icons',
    'nuxt-helmet',
  ],
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        light: {
          primary: '#086b94', // colors.blue.darken2,
        },
      },
    },
  },
  // helmet options
  // @see https://helmetjs.github.io/docs/
  helmet: {
    /*
    dnsPrefetchControl: true,
    expectCt: true,
    featurePolicy: true,
    frameguard: true,
    hidePoweredBy: true,
    hsts: true,
    ieNoOpen: true,
    noCache: true,
    noSniff: true,
    permittedCrossDomainPolicies: true,
    referrerPolicy: true,
    xssFilter: true,
    */
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {},
  },
}
