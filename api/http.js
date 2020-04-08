'use strict'
import axios from 'axios'

const token = (function () {
  let _token = null
  const isClient = !process.server
  return {
    set(token) {
      // `Bearer ${token}`;
      if (isClient) localStorage.setItem('_t', token)
      _token = token
    },
    get() {
      if (!isClient) return _token
      if (_token) return _token
      _token = localStorage.getItem('_t')
      return _token
    },
    delete() {
      if (isClient) localStorage.removeItem('_t')
      _token = null
    },
  }
})()

// axios defaults
axios.defaults.baseURL = process.env.BASE_URL
axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.headers.post['Cache-Control'] = 'no-cache'

function showMsg(type, response) {
  if (process.env.NODE_ENV === 'development' && !process.server) {
    // eslint-disable-next-line
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
    if (token.get()) config.headers.authorization = token.get()
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
    if (!token.get()) {
      const token = response.headers.authorization
      if (token) token.set(token)
    }

    const totalItems = response.headers['x-total-count']
    if (typeof totalItems !== 'undefined') {
      response.totalItems = parseInt(totalItems, 10)
    }
    const data = response.data.data || response.data || null
    const error = response.data.error || null
    const message = response.data.message || ''
    showMsg('info', response)
    response.data = data
    response.error = error
    response.message = message
    return response
  },
  // https://github.com/axios/axios#handling-errors
  function ({ response }) {
    if (response) {
      // login out 401 or 403
      const error =
        response.data.name === 'MongoError'
          ? 'Error al guardar en mongoDB'
          : response.data.error || null
      const message = response.data.message || ''
      const data = response.data.data || response.data || null
      showMsg('error', response)
      response.data = data
      response.error = error
      response.message = message
      if (response.status === 401 || response.status === 403) {
        token.delete()
        if (!process.server) window.location.replace('/login')
      }
    }
    return Promise.reject(response)
  }
)

export default axios
