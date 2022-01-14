const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    correlativo: { type: Number, require: true },
    numeroReceta: { type: Number, require: true },
    tipoReceta: { type: Number, require: true },
    rutPaciente: { type: String, require: true, select: false },
    medicoPrescriptor: { type: String, require: true },
    patologia: String,
    recetaRetenida: { type: Boolean, default: false },
    fechaEmision: { type: Date, require: true },
    codigoEstablecimiento: { type: String, require: true },
    nombreEstablecimiento: { type: String, require: true },
    pases: [
      {
        numeroReceta: { type: Number, require: true },
        fechaEmisionFutura: { type: Date, require: true },
        numeroPase: { type: Number, require: true },
      },
    ],
    medicamentos: {
      type: [
        {
          nombreMedicamento: { type: String, require: true },
          medicamentoControlado: { type: Boolean, default: false },
          mensaje: { type: String, require: true },
        },
      ],
      require: true,
    },
  },
  { timestamps: true }
);

const Recetas = mongoose.model("receta", schema);

module.exports = Recetas;
