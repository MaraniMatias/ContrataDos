import express from 'express'
import { sendRes, auth } from '../utilities/router'
// import { checkErrors, check } from '../utilities/checkProps'
import { save } from '../utilities/fileImagen'
import { Persona } from '../models/persona'
const multer = require('multer')
const upload = multer()

// Create express router
const router = express.Router()

// Transform req & res to have the same API as express
// So we can use res.status() & res.json()
const app = express()
router.use((req, res, next) => {
  Object.setPrototypeOf(req, app.request)
  Object.setPrototypeOf(res, app.response)
  req.res = res
  res.req = req
  next()
})
router.use(auth.setUser)

router.post('/perfil', auth.isLogin, upload.single('file'), async function (
  req,
  res
) {
  try {
    // TODO falta los check del body
    // TODO corp imagen de perfil
    const corp = JSON.parse(req.body.dto)
    console.log(corp)

    const _id = req.user._id
    const extension = req.file.originalname.match(/[^.]+$/)[0]
    await save(req.file.buffer, '/perfil/' + _id + '.' + extension)
    const obj = await Persona.updateOne(
      { _id },
      { picture: '/images/perfil/' + _id }
    )
    return sendRes(res, 200, obj.ok, 'Success', null)
  } catch (err) {
    return sendRes(
      res,
      500,
      null,
      'error',
      err ? err.message : 'Algo salio mal :('
    )
  }
})

/*
router.get('/perfil', async function (req, res) {
  try {
    const fileName = req.query.nombre + '.' + req.query.extension
    return res.download(
      path.join(DOC_BASE_PATH, req.params.uuid + '.' + req.query.extension),
      fileName
    )
  } catch (err) {
    return sendRes(
      res,
      500,
      null,
      'error',
      err ? err.message : 'Algo salio mal :('
    )
  }
})
*/

export default router
