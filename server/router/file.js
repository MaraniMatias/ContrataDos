import { sendRes, auth } from '../utilities/router'
// import { checkErrors, check } from '../utilities/checkProps'
import { save } from '../utilities/fileImagen'
import { Persona } from '../models/persona'
import { Trabajo } from '../models/trabajo'
import router from './nuxtRouter'

const multer = require('multer')
const upload = multer()

router.post('/trabajo', auth.isLogin, upload.single('file'), async function (
  req,
  res
) {
  try {
    // TODO falta los check del body
    const model = JSON.parse(req.body.dto)
    model.profesional = req.user._id
    model.deleted = false

    const trabajo = await Trabajo.create(model)
    const _id = trabajo._id
    const extension = req.file.originalname.match(/[^.]+$/)[0]
    const fileName = _id + '.' + extension
    await save(req.file.buffer, '/jobs/' + fileName)

    return sendRes(res, 200, trabajo, 'Success', null)
  } catch (err) {
    return sendRes(res, 500, null, err ? err.message : 'Algo salio mal :(', err)
  }
})

router.post('/perfil', auth.isLogin, upload.single('file'), async function (
  req,
  res
) {
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
    return sendRes(res, 500, null, err ? err.message : 'Algo salio mal :(', err)
  }
})

/*
router.get('/perfil', async function (req, res) {
  try {
    const fileName = req.query.nombre + '.' + req.query.extension
    return res.download(path.join(DOC_BASE_PATH, req.params.uuid + '.' + req.query.extension),fileName)
  } catch (err) {
    return sendRes(res,500,null,'error',err ? err.message : 'Algo salio mal :(')
  }
})
*/

export default router
