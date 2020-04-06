const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.Types.ObjectId

const schema = new Schema(
  {
    from: { type: ObjectId, required: true, ref: 'persona' },
    to: { type: ObjectId, required: true, ref: 'persona' },
    trabajo: { type: ObjectId, required: true, ref: 'trabajo' },
    detalle: { type: String, trim: true, max: 120 },
    fecha: { type: Date }, // Propone una fecha para el trabajo
  },
  { timestamps: true }
)
schema.set('toJSON', { virtuals: true })

module.exports.Comunicacion = mongoose.model('comunicacion', schema)
