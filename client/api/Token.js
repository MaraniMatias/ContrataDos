'use strict'
export default (function () {
  let _token = null
  const isClient = !process.server
  return {
    set(token) {
      _token = /^Bearer\s.+$/.test(token) ? token : `Bearer ${token}`
      if (isClient) localStorage.setItem('_t', _token)
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
    deleteAll() {
      if (isClient) localStorage.clear()
      _token = null
    },
  }
})()
