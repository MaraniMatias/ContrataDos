const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
  nombre: { type: String, trim: true, required: true },
  descripcion: { type: String, trim: true },
})
schema.set('toJSON', { virtuals: true })

module.exports.Habilidad = mongoose.model('habilidad', schema)
