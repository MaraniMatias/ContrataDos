const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const schema = new Schema({
  cod_postal: { type: Number, required: true },
  nombre: { type: String, trim: true, required: true },
  provincia: { type: ObjectId, ref: "provincia" },
  coordenadas: {
    lat: { type: String, trim: true, required: "Latitud requerida" },
    lon: { type: String, trim: true, required: "Longitud requerida" }
  }
});

module.exports.Localidad = mongoose.model("localidad", schema);
