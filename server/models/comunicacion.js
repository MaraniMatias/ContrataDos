const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.Types.ObjectId

const schema = new Schema(
  {
    from: { type: ObjectId, required: true, ref: 'persona' },
    to: { type: ObjectId, required: true, ref: 'persona' },
    trabajo: { type: ObjectId, required: true, ref: 'trabajo' },
    detalle: { type: String, trim: true, required: true, max: 500 },
  },
  { timestamps: true }
)
schema.set('toJSON', { virtuals: true })

module.exports.Comunicacion = mongoose.model('comunicacion', schema)
