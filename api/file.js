import axios from 'axios'
const BASE_URL = process.env.BASE_URL + '/api/file'
let EVENT

function emit(event) {
  const percentage = event.value * (100 / event.total)
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

const perfil = async function (file, corp = {}) {
  try {
    if (typeof file === 'undefined') {
      return new Error('Archivo es requerido.')
    }

    // const fileValid = ["image/x-png","image/gif","image/jpeg"    ].includes(file.type)
    const fileValid = /image/.test(file.type)
    if (fileValid === false) {
      return new Error('Archivo no valido.')
    }
    emit({ value: 0, total: file.size, percentage: 0 })

    const onUploadProgress = (event) => {
      const percentage = event.loaded * (100 / event.total)
      emit({
        value: event.loaded,
        total: event.total,
        percentage: percentage.toFixed(2),
      })
    }

    const formData = new FormData()
    formData.append('dto', JSON.stringify(corp))
    formData.append('file', file)

    return await axios({
      url: BASE_URL + '/perfil',
      method: 'POST',
      data: formData,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    })
  } catch (err) {
    return { error: err?.message || 'ApiError' }
  }
}

export default (evetName) => {
  EVENT = evetName
  return {
    perfil,
  }
}
