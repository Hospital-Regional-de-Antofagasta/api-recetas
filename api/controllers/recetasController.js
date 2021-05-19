const Recetas = require("../models/Recetas");
const RecetasDetalles = require("../models/RecetasDetalles");
const { mensajes } = require("../config");

exports.getRecetasPaciente = async (req, res) => {
  try {
    const arregloRecetas = await Recetas.find({
      numeroPaciente: req.numeroPaciente,
    }).exec();
    res.status(200).send(arregloRecetas);
  } catch (error) {
    res.status(500).send({ respuesta: mensajes.serverError });
  }
};

exports.getDetallesReceta = async (req, res) => {
  try {
    const recetaConDetalles = await Promise.all([
      Recetas.findOne({
        numeroRecetaOriginal: req.params.numero,
        tipoRecetaOriginal: req.params.tipo,
      }).exec(),
      RecetasDetalles.findOne({
        numeroRecetaOriginal: req.params.numero,
        tipoRecetaOriginal: req.params.tipo,
      }).exec(),
    ]);
    if (recetaConDetalles[0] === null || recetaConDetalles[1] === null) {
      res.sendStatus(200);
      return;
    }
    const recetaDetallada = {
      numeroRecetaOriginal: recetaConDetalles[0]["numeroRecetaOriginal"],
      tipoRecetaOriginal: recetaConDetalles[0]["tipoRecetaOriginal"],
      medicoPrescriptor: recetaConDetalles[0]["medicoPrescriptor"],
      numeroPaciente: recetaConDetalles[0]["numeroPaciente"],
      patologiaCronica: recetaConDetalles[0]["patologiaCronica"],
      pases: recetaConDetalles[0]["pases"],
      medicamentos: recetaConDetalles[1]["medicamentos"],
    };
    res.status(200).send(recetaDetallada);
  } catch (error) {
    res.status(500).send({ respuesta: mensajes.serverError });
  }
};
