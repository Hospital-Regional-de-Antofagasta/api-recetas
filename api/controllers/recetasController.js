const Recetas = require("../models/Recetas");
const { getMensajes } = require("../config");

exports.getRecetasPaciente = async (req, res) => {
  try {
    const arregloRecetas = await Recetas.find({
      numeroPaciente: req.numeroPaciente,
    }).exec();
    res.status(200).send(arregloRecetas);
  } catch (error) {
    res.status(500).send({ respuesta: await getMensajes("serverError") });
  }
};
