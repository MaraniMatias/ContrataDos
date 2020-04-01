const toFile = (base64, fileName = 'sin_nombre') =>
  new Promise(function (resolve, reject) {
    // fetch(`data:${mimeType};base64,${base64}`)
    const type = /data:(.+);/.exec(base64)[1]
    const ext = type.split('/')[1]
    fetch(base64)
      .then((res) => res.blob())
      .then((blob) => new File([blob], fileName + '.' + ext, { type }))
      .then(resolve)
      .catch(reject)
  })

export default {
  toFile,
}
