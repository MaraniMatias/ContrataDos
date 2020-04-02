const mongoose = require('mongoose')
const escapeHtml = require('escape-html')
const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.Types.ObjectId

const TipoTrabajo = {
  PUBLICO: 'PUBLICO',
  PRIVADO: 'PRIVADO',
}
module.exports.TipoTrabajo = TipoTrabajo

const schema = new Schema(
  {
    cliente: { type: ObjectId, ref: 'persona' },
    profesional: { type: ObjectId, ref: 'persona' },
    localidad: { type: ObjectId, ref: 'localidad' },
    tipo: {
      type: String,
      default: TipoTrabajo.PUBLICO, // Son privados los que son programados/pendientres, o finalizados pero no publicados
      enum: [TipoTrabajo.PRIVADO, TipoTrabajo.PRIVADO],
    },
    puntuacion: { type: Number, default: 0 },
    // foto, usar el _id para referenciar la foto o mejor un id unico universal
    descripcion: { type: String, max: 500, trim: true, set: escapeHtml },
    descripcion_breve: {
      type: String,
      trim: true,
      required: true,
      max: 120,
      set: escapeHtml,
    },
    servicios: [{ type: ObjectId, ref: 'habilidad' }],
    agenda: [{ type: ObjectId, ref: 'agenda' }], // Lista de eventos, agenda, si se re programa tiene varios
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
)
schema.set('toJSON', { virtuals: true })

module.exports.Trabajo = mongoose.model('trabajo', schema)
