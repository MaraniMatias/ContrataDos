const mongoose = require('mongoose')
const escapeHtml = require('escape-html')
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.Types.ObjectId
const saltRounds = 10

const PersonaRol = {
  CLIENTE: 'CLIENTE',
  PROFECIONAL: 'PROFECIONAL',
  ADMIN: 'ADMIN',
}
module.exports.PersonaRol = PersonaRol

const schema = new Schema(
  {
    nombre: { type: String, trim: true, required: 'El nombre es requerido' },
    apellido: {
      type: String,
      trim: true,
      required: 'El apellido es requerido',
    },
    razon_social: { type: String, trim: true }, // O Nombre fisticio
    bibliography: { type: String, max: 500, trim: true, set: escapeHtml },
    email: {
      type: String,
      unique: true,
      trim: true,
      sparse: true,
      required: 'El mail es requerido',
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Por favor, complete ingrese una dirección de correo electrónico válida',
      ],
    },
    roles: [
      {
        type: String,
        default: PersonaRol.CLIENTE,
        enum: [PersonaRol.CLIENTE, PersonaRol.PROFECIONAL, PersonaRol.ADMIN],
        required: 'Rol es requerido',
      },
    ],
    servicios: [{ type: ObjectId, ref: 'habilidad' }],
    localidad: { type: ObjectId, ref: 'localidad' }, // Del trabajador
    puntuacion: { type: Number, default: 0 }, // TODO 0 al 100, calcular con algun metodo
    cantidad_trabajos: { type: Number, default: 0 }, // TODO Incrementar al terminar un trabajo
    google_account: { type: Object, access: 'protected' }, // Datos de google,
    picture: String,
    password: { type: String, access: 'protected' },
    zona_trabajo: [{ type: ObjectId, ref: 'localidad' }], // libre todo el mundo
    deleted: { type: Boolean, default: false },
    show_tutorial: { type: Boolean, default: true },
    // tags: [{ type: String, access: 'protected' }],
  },
  { timestamps: true }
)
schema.set('toJSON', { virtuals: true })

schema.virtual('display_name').get(function () {
  return this.razon_social || this.apellido + ' ' + this.nombre
})

schema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, saltRounds)
  } else next()
})

// Checks password match
// XXX using awit
schema.method('authenticate', function (password) {
  return bcrypt.compare(password, this.password)
})

schema.static('findOrCreate', function (condition, user, callback) {
  const self = this
  self.findOne(condition, (err, result) => {
    if (err || result) {
      callback(err, result)
    } else {
      self.create(user, (err, userBD) => {
        callback(err, userBD)
      })
    }
  })
})

module.exports.Persona = mongoose.model('persona', schema)
