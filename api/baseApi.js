import http from './http'

const get = (BASE_URL) => async (params = {}) => {
  try {
    if (params.query) {
      params.query.deleted = false
    } else {
      params.query = { deleted: false }
    }
    return await http.get(BASE_URL, { params })
  } catch (err) {
    return { error: err?.message || 'ApiError' }
  }
}

const getAll = (BASE_URL) => async (params = {}) => {
  try {
    return await http.get(BASE_URL, { params })
  } catch (err) {
    return { error: err?.message || 'ApiError' }
  }
}

const getById = (BASE_URL) => async (_id, params = {}) => {
  try {
    return await http.get(BASE_URL + `/${_id}`, { params })
  } catch (err) {
    return { error: err?.message || 'ApiError' }
  }
}

const save = (BASE_URL) => async (object = {}) => {
  try {
    if (object._id) return await http.patch(BASE_URL + `/${object._id}`, object)
    else return await http.post(BASE_URL, object)
  } catch (err) {
    return { error: err?.message || 'ApiError' }
  }
}

const del = (BASE_URL) => async (object = {}) => {
  try {
    return await http.path(BASE_URL + `/${object._id}`, { deleted: true })
  } catch (err) {
    return { error: err?.message || 'ApiError' }
  }
}

export default (url) => {
  const BASE_URL = process.env.BASE_URL + '/api' + url
  return {
    save: save(BASE_URL),
    delete: del(BASE_URL),
    getAll: getAll(BASE_URL),
    get: get(BASE_URL),
    getById: getById(BASE_URL),
  }
}
