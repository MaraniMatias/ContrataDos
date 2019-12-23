const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const PersonaRol = {
  CLIENTE: "CLIENTE",
  PROFECIONAL: "PROFECIONAL",
  ADMIN: "ADMIN"
};
module.exports.PersonaRol = PersonaRol;

const schema = new Schema(
  {
    nombre: { type: String, trim: true, required: "El nombre es requerido" },
    apellido: { type: String, trim: true, required: "El apellido es requerido" },
    razon_social: { type: String, trim: true }, // O Nombre fisticio
    email: {
      type: String,
      unique: true,
      trim: true,
      sparse: true,
      required: "El mail es requerido",
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Por favor, complete ingrese una dirección de correo electrónico válida"
      ]
    },
    roles: [
      {
        type: String,
        default: PersonaRol.CLIENTE,
        enum: [PersonaRol.CLIENTE, PersonaRol.PROFECIONAL, PersonaRol.ADMIN],
        required: "Rol es requerido"
      }
    ],
    servicios: [{ type: ObjectId, ref: "habilidad" }],
    localidad: [{ type: ObjectId, ref: "localidad" }],
    puntuacion: Number, // TODO 0 al 10, calcular con algun metodo
    cantidad_trabajos: Number, // TODO Incrementar al terminar un trabajo
    google_account: { type: Object, access: "protected" }, // Datos de google,
    zona_trabajo: [{ type: ObjectId, ref: "localidad" }], // libre todo el mundo
    deleted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

schema.virtual("usuario").get(function() {
  return this.razon_social || this.apellido + " " + this.nombre;
});

module.exports.Persona = mongoose.model("persona", schema);
