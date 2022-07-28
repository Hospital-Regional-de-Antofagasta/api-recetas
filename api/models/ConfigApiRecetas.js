const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ConfigApiRecetas = mongoose.model(
  "config_api_recetas",
  new Schema(
    {
      mensajes: {
        forbiddenAccess: {
          titulo: String,
          mensaje: String,
          color: String,
          icono: String,
        },
        serverError: {
          titulo: String,
          mensaje: String,
          color: String,
          icono: String,
        },
      },
      version: Number,
    },
    { timestamps: true }
  ),
  "config_api_recetas"
);

module.exports = ConfigApiRecetas;
