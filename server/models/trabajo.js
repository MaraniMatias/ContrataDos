const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.Types.ObjectId

const TipoTrabajo = {
  PUBLICO: 'PUBLICO',
  PRIVADO: 'PRIVADO'
}
module.exports.TipoTrabajo = TipoTrabajo

const schema = new Schema(
  {
    cliente: [{ type: ObjectId, ref: 'persona' }],
    profesional: [{ type: ObjectId, ref: 'persona' }],
    localidad: { type: ObjectId, ref: 'localidad' },
    tipo: [
      {
        type: String,
        default: TipoTrabajo.PUBLICO,
        enum: [TipoTrabajo.PRIVADO, TipoTrabajo.PRIVADO]
      }
    ],
    puntuacion: Number,
    // foto, usar el _id para referenciar la foto o mejor un id unico universal
    descripcion: String,
    servicios: [{ type: ObjectId, ref: 'habilidad' }], // para simplificar usaremos uno
    agenda: [{ type: ObjectId, ref: 'agenda' }], // Lista de eventos, agenda, si se re programa tiene varios
    deleted: { type: Boolean, default: false }
  },
  { timestamps: true }
)

module.exports.Trabajo = mongoose.model('trabajo', schema)
