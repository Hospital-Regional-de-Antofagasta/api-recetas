const Recetas = require("../models/Recetas");
const { getMensajes } = require("../config");

exports.getRecetasPaciente = async (req, res) => {
  try {
    const arregloRecetas = await Recetas.find({
      numeroPaciente: { $in: req.numerosPaciente },
    }).exec();
    res.status(200).send(arregloRecetas);
  } catch (error) {
    if (process.env.NODE_ENV === "dev")
      return res.status(500).send({
        respuesta: await getMensajes("serverError"),
        detalles_error: {
          nombre: error.name,
          mensaje: error.message,
        },
      });
    res.status(500).send({ respuesta: await getMensajes("serverError") });
  }
};
