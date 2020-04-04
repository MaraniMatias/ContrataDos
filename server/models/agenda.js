const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.Types.ObjectId

const { Estados } = require('../../utils/enums')
module.exports.Estados = Estados

const schema = new Schema(
  {
    cliente: [{ type: ObjectId, ref: 'persona' }],
    profesional: [{ type: ObjectId, ref: 'persona' }],
    estado: [
      {
        type: String,
        default: Estados.PENDIENTE_CONFIRMACION,
        enum: [
          Estados.PENDIENTE_CONFIRMACION,
          Estados.PENDIENTE_REALIZACION,
          Estados.EN_PROGRESO,
          Estados.TERMINADA,
          Estados.CANCELADA,
        ],
      },
    ],
    trabajo: [{ type: ObjectId, ref: 'trabajo' }],
    fecha_inicio: { type: Date, default: Date.now() },
    fecha_fin: { type: Date },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
)
schema.set('toJSON', { virtuals: true })

module.exports.Agenda = mongoose.model('agenda', schema)
