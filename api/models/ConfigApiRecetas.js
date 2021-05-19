const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ConfigApiRecetas = mongoose.model(
  "config_api_receta",
  new Schema({
    mensajesRecetas: {
      forbiddenAccess: String,
      serverError: String,
      version: Number,
    },
  })
);

module.exports = ConfigApiRecetas;
