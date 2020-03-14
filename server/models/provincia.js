const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const Localidad = require("./localidad");

const schema = new Schema({
  nombre: { type: String, trim: true, required: true },
  localidades: [{ type: ObjectId, ref: "localidad", required: true }]
});

schema.method("updateIdLocalidades", function(callback) {
  const provinciaID = this._id;
  this.localidades.forEach(loc => {
    Localidad.findById(loc, (err, localidad) => {
      if (err || !localidad) {
        callback(err, null);
      } else {
        localidad.provincia = provinciaID;
        localidad.save(function(err, localidadDB) {
          if (err || !localidadDB) {
            callback(err, null);
          } else {
            callback(err, localidadDB);
          }
        });
      }
    });
  });
});

module.exports.Provincia = mongoose.model("provincia", schema);
