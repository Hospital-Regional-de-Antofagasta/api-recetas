const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    numeroRecetaOriginal: Number,
    tipoRecetaOriginal: Number,
    medicoPrescriptor: String,
    numeroPaciente: {
      numero: { type: Number, select: false },
      codigoEstablecimiento: { type: String, select: false },
      hospital: {type: Object, select: false },
      nombreEstablecimiento: String,
    },
    patologiaCronica: String,
    recetaRetenida: Boolean,
    pases: [
      {
        numeroReceta: Number,
        fechaEmision: Date,
        numeroPase: Number,
      },
    ],
    medicamentos: [
      {
        nombreMaterial: String,
        dosis: Number,
        dias: Number,
        cantidadDias: Number,
        medicamentoControlado: Boolean,
      },
    ],
  },
  { timestamps: true }
);

const Recetas = mongoose.model("receta", schema);

module.exports = Recetas;
