const express = require('express')
const router = express.Router()
const multer = require('multer')
const { sendRes, auth } = require('../utilities/router')
const { save } = require('../utilities/fileImagen')
const { Persona } = require('../models/persona')
const { Trabajo } = require('../models/trabajo')

const upload = multer()

router.post(
  '/api/file/trabajo',
  auth.isLogin,
  upload.single('file'),
  async function (req, res) {
    try {
      // TODO falta los check del body
      const model = JSON.parse(req.body.dto)
      model.profesional = req.user._id
      model.deleted = false

      let trabajo
      if (typeof model._id === 'undefined') {
        trabajo = await Trabajo.create(model)
      } else {
        trabajo = await Trabajo.findByIdAndUpdate(model._id, model)
      }

      const extension = req.file.originalname.match(/[^.]+$/)[0]
      const fileName = trabajo._id + '.' + extension
      await save(req.file.buffer, '/jobs/' + fileName)

      return sendRes(res, 200, trabajo, 'Success', null)
    } catch (err) {
      return sendRes(
        res,
        500,
        null,
        err ? err.message : 'Algo salio mal :(',
        err
      )
    }
  }
)

router.post(
  '/api/file/perfil',
  auth.isLogin,
  upload.single('file'),
  async function (req, res) {
    try {
      // TODO falta los check del body
      const _id = req.user._id

      const extension = req.file.originalname.match(/[^.]+$/)[0]
      const fileName = _id + '.' + extension
      await save(req.file.buffer, '/perfil/' + fileName)

      const picturePath = '/images/perfil/' + fileName
      await Persona.findByIdAndUpdate(_id, { picture: picturePath })
      req.user.picture = picturePath
      return sendRes(res, 200, req.user, 'Success', null)
    } catch (err) {
      return sendRes(
        res,
        500,
        null,
        err ? err.message : 'Algo salio mal :(',
        err
      )
    }
  }
)

/*
router.get('/api/perfil', async function (req, res) {
  try {
    const fileName = req.query.nombre + '.' + req.query.extension
    return res.download(path.join(DOC_BASE_PATH, req.params.uuid + '.' + req.query.extension),fileName)
  } catch (err) {
    return sendRes(res,500,null,'error',err ? err.message : 'Algo salio mal :(')
  }
})
*/

module.exports = router
