import http from './http'

const get = (BASE_URL) => async (query = {}) => {
  try {
    query.deleted = false
    return await http.get(BASE_URL, { params: query })
  } catch (err) {
    return { error: err?.message || 'ApiError' }
  }
}

const getAll = (BASE_URL) => async (query = {}) => {
  try {
    return await http.get(BASE_URL, { params: query })
  } catch (err) {
    return { error: err?.message || 'ApiError' }
  }
}

const getById = (BASE_URL) => async (_id) => {
  try {
    return await http.get(BASE_URL + `/${_id}`)
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
