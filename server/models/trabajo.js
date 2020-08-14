const mongoose = require('mongoose')
const escapeHtml = require('escape-html')
const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.Types.ObjectId

const {
  TipoTrabajo,
  EstadoTrabajo,
  RatingTrabajo,
} = require('../utilities/enums')
module.exports.TipoTrabajo = TipoTrabajo
module.exports.EstadoTrabajo = EstadoTrabajo
module.exports.RatingTrabajo = RatingTrabajo

const schema = new Schema(
  {
    cliente: { type: ObjectId, ref: 'persona' },
    profesional: { type: ObjectId, ref: 'persona' },
    localidad: { type: ObjectId, ref: 'localidad' },
    estado: {
      type: String,
      default: EstadoTrabajo.CONSULTA,
      enum: Object.values(EstadoTrabajo),
    },
    tipo: {
      type: String,
      default: TipoTrabajo.PUBLICO, // Son privados los que son programados/pendientres, o finalizados pero no publicados
      enum: [TipoTrabajo.PUBLICO, TipoTrabajo.PRIVADO],
    },
    rating: {
      type: String,
      enum: [RatingTrabajo.LIKE, RatingTrabajo.DONT_LIKE],
    },
    // foto, usar el _id para referenciar la foto o mejor un id unico universal
    notas: { type: String, max: 500, trim: true },
    descripcion: {
      type: String,
      max: 500,
      trim: true,
      set: escapeHtml,
      lowercase: true,
    },
    descripcion_breve: {
      type: String,
      trim: true,
      required: true,
      max: 120,
      set: escapeHtml,
    },
    servicios: [{ type: ObjectId, ref: 'habilidad' }],
    // Lista de eventos, agenda, si se re programa tiene varios
    agenda: [
      {
        fecha_inicio: { type: Date, default: Date.now() },
        fecha_fin: { type: Date },
      },
    ],
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
)
schema.set('toJSON', { virtuals: true })

module.exports.Trabajo = mongoose.model('trabajo', schema)
