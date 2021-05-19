const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RecetasDetalles = mongoose.model(
  "recetas_detalle",
  new Schema({
    numeroRecetaOriginal: Number,
    tipoRecetaOriginal: Number,
    medicamentos: [
      {
        nombreMaterial: String,
        dosis: Number,
        dias: Number,
        cantidadDias: Number,
      },
    ],
  })
);

module.exports = RecetasDetalles;
