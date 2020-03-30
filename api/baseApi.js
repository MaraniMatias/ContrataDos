import http from './http'

const getAll = (BASE_URL) => async () => {
  try {
    return await http.get(BASE_URL)
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
    if (object._id) return await http.post(BASE_URL, object)
    else return await http.path(BASE_URL + `/${object._id}`, object)
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
    getById: getById(BASE_URL),
  }
}
