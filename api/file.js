import axios from 'axios'
const BASE_URL = process.env.SERVER_URL + '/api/file'
let EVENT

function emit({ loaded = 0, total }) {
  const percentage = loaded * (100 / total)
  console.log(EVENT, percentage)
  /*
  const evt = new CustomEvent(EVENT, {
    value: event.loaded,
    total: event.total,
    percentage: percentage.toFixed(2),
  })
  window.dispatchEvent(evt)
*/
}
/*
window.addEventListener(EVENT, function (progress) {
  console.log('printer state changed', progress)
})
*/

const trabajo = async function (file, body = {}) {
  try {
    if (typeof file === 'undefined') {
      return new Error('Archivo es requerido.')
    }

    // const fileValid = ["image/x-png","image/gif","image/jpeg"    ].includes(file.type)
    const fileValid = /image/.test(file.type)
    if (fileValid === false) {
      return new Error('Archivo no valido.')
    }
    emit({ total: file.size })

    const formData = new FormData()
    formData.append('dto', JSON.stringify(body))
    formData.append('file', file)

    return await axios({
      url: BASE_URL + '/trabajo',
      // method: body._id ? 'PATCH' : 'POST',
      method: 'POST',
      data: formData,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: emit,
    })
  } catch (err) {
    return { error: err?.message || 'ApiError' }
  }
}

const perfil = async function (file) {
  try {
    if (typeof file === 'undefined') {
      return new Error('Archivo es requerido.')
    }

    // const fileValid = ["image/x-png","image/gif","image/jpeg"    ].includes(file.type)
    const fileValid = /image/.test(file.type)
    if (fileValid === false) {
      return new Error('Archivo no valido.')
    }
    emit({ total: file.size })

    const formData = new FormData()
    formData.append('file', file)

    return await axios({
      url: BASE_URL + '/perfil',
      method: 'POST',
      data: formData,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: emit,
    })
  } catch (err) {
    return { error: err?.message || 'ApiError' }
  }
}

export default (evetName) => {
  EVENT = evetName
  return { perfil, trabajo }
}
