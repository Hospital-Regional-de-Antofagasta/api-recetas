const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    correlativo: { type: Number, required: true },
    numeroReceta: { type: Number, required: true },
    tipoReceta: { type: Number, required: true },
    rutPaciente: { type: String, required: true, select: false },
    medicoPrescriptor: { type: String, required: true },
    patologia: String,
    recetaRetenida: { type: Boolean, default: false },
    fechaEmision: { type: Date, required: true },
    codigoEstablecimiento: { type: String, required: true },
    nombreEstablecimiento: { type: String, required: true },
    pases: [
      {
        numeroReceta: { type: Number, required: true },
        fechaEmisionFutura: { type: Date, required: true },
        numeroPase: { type: Number, required: true },
      },
    ],
    medicamentos: {
      type: [
        {
          nombreMedicamento: { type: String, required: true },
          medicamentoControlado: { type: Boolean, default: false },
          mensaje: { type: String, required: true },
        },
      ],
      required: true,
    },
  },
  { timestamps: true }
);

const Recetas = mongoose.model("receta", schema);

module.exports = Recetas;
