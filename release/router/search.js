const express = require('express')
const router = express.Router()
const { sendRes } = require('../utilities/router')
const { Habilidad } = require('../models/habilidad')
const { Localidad } = require('../models/localidad')

router.get('/api/search', async function (req, res) {
  try {
    const query = req.query.q // plomero + casilda
    let items = []

    const localidades = await Localidad.find({
      nombre: { $regex: query, $options: 'i' },
    })
    const localidadList = localidades.map(({ _id, nombre }) => ({
      _id,
      text: nombre,
      type: 'localidad',
    }))
    items = items.concat(localidadList)

    const habilidades = await Habilidad.find({
      nombre: { $regex: query, $options: 'i' },
    })
    const habilidadList = habilidades.map(({ _id, nombre }) => ({
      _id,
      text: nombre,
      type: 'habilidad',
    }))
    items = items.concat(habilidadList)

    // res, status, data, message, error
    return sendRes(res, 200, items, 'Success', null)
  } catch (err) {
    res.render('/')
  }
})

module.exports = router

/*
router.get('/search', async function (req, res) {
  console.log(req.query) // plomero + casilda
  const query = 'profesor en casida' //  y plomero en rosario'
  console.log(query)

  // TODO, Servicio, localidad, bilbiografia, nombre, apellido, razon_social
  const search = await User.find({ tags: { $in: tokenizer.tokenize(query) } })

  // -----------------
  const source = 'Soy profesor y plomero, realizo trabajos en casilda y zona'
  const target = 'plomero en casilda'
  console.log(natural.LevenshteinDistance(source, target))
  console.log(natural.LevenshteinDistance(source, 'profesor en rosario'))
  console.log(natural.LevenshteinDistance(source, 'profesor'))

  // res, status, data, message, error
  return sendRes(res, 200, search, 'Success', null)
})
import natural from 'natural'
import { Habilidad } from '../models/habilidad'
import { Location } from '../models/localidad'
const tokenizer = new natural.AggressiveTokenizerEs()
        // TODO filtar solo profeciones, y localidades
        const biblo = tokenizer.tokenize(persona.bibliography)
        const tags = new Set(biblo)
        tags.add(persona.nombre)
        tags.add(persona.apellido)
        tags.add(persona.email)
        tags.add(persona.razon_social)
        // const servicios = await Habilidad.find({_id:persona.servicios})
        // tags.add() // add habilidades
        const servicios = await Location.findById(persona.localidad)
        tags.add(servicios) // add localidad
        persona.tags = Array.from(tags)
*/
