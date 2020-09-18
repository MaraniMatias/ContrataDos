require('dotenv-flow').config({ purge_dotenv: true, silent: true })

module.exports = {
  ssr: false,
  rootDir: '.',
  srcDir: './client/',

  env: {
    NUXT_SERVER_URL: process.env.NUXT_SERVER_URL,
  },
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
    { src: '~/plugins/axion', mode: 'client' },
    { src: '~/plugins/globalComponents', mode: 'client' },
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
    [
      'nuxt-social-meta',
      {
        url: 'contratados.com',
        title: 'ContrataDos',
        description: 'Encuentra un profesional',
        img: '~/assets/logo.png',
        locale: 'es_ES',
        twitter: '@maranimaitas',
        themeColor: '#086b94',
      },
    ],
    'nuxt-material-design-icons',
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
  /*
   ** Build configuration
   */
  build: {
    // analyze: process.env.NODE_ENV === 'production',
    filenames: {
      app: ({ isDev }) => (isDev ? '[name].js' : '[contenthash].js'),
      chunk: ({ isDev }) => (isDev ? '[name].js' : '[id].[contenthash].js'),
    },
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      if (ctx && ctx.isClient) {
        config.optimization.splitChunks.maxSize = 1324000
      }
    },
  },
}
