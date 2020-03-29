'use strict'
import axios from 'axios'
// import store from '../store/index'
// import router from '../router'

// axios defaults
axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.headers.post['Cache-Control'] = 'no-cache'

function showMsg(type, response) {
  if (process.env.NODE_ENV === 'development') {
    console[type](
      '%c[%s]%c %c%s %c%s\n',
      'font-weight: 600',
      response.config.method.toUpperCase(),
      'font-weight: 400',
      response.status === 200
        ? 'color: green'
        : response.status !== 500
        ? 'color: purple'
        : 'color: red',
      response.status,
      'color: blue',
      response.config.url,
      response
    )
  }
}

// Add a request interceptor
axios.interceptors.request.use(
  function (config) {
    // if (store.state.token) config.headers.authorization = `Bearer ${store.state.token}`
    return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  }
)

// Add a response interceptor
axios.interceptors.response.use(
  function (response) {
    showMsg('info', response)
    const totalItems = response.headers['x-total-count']
    if (typeof totalItems !== 'undefined') {
      response.data._totalItems = parseInt(totalItems, 10)
    }
    response.data = response.data.data || response.data || null
    response.error = response.data.errors || null
    response.message = response.data.message || ''
    return response
  },
  // https://github.com/axios/axios#handling-errors
  function ({ response }) {
    if (response) {
      showMsg('error', response)
      const data =
        typeof response.data.data !== 'undefined'
          ? response.data.data
          : response.data
          ? response.data
          : {}
      const error =
        response.data.name === 'MongoError'
          ? 'Error al guardar en mongoDB'
          : response.data.errors || null
      const message = response.data.message || ''

      switch (response.status) {
        case 401:
        case 403:
          // store.dispatch("auth/signOut");
          // router.replace("login");
          break
        default:
          response.error = error
          response.message = message
          response.data = data
          break
      }
    }
    return Promise.reject(response)
  }
)

export default axios
