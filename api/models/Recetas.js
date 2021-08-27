const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    numeroRecetaOriginal: Number,
    tipoRecetaOriginal: Number,
    medicoPrescriptor: String,
    numeroPaciente: { type: Number, select: false },
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
        dosis: { type: Number, select: false },
        dias: { type: Number, select: false },
        cantidadDias: { type: Number, select: false },
        medicamentoControlado: Boolean,
        mensaje: String,
      },
    ],
  },
  { timestamps: true }
);

const Recetas = mongoose.model("receta", schema);

module.exports = Recetas;
